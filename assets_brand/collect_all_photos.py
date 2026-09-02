import time
import json
import re
import sys
import os

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='msedge', headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            viewport={'width': 1280, 'height': 900},
            locale='id-ID'
        )
        page = context.new_page()

        raw_urls = set()

        def handle_response(response):
            url = response.url
            if 'googleusercontent.com' in url:
                if not re.search(r'/a[a-z0-9\-]*/', url):
                    raw_urls.add(url)

        page.on('response', handle_response)

        target_url = "https://www.google.com/maps/place/Homie+Cozie+Coffee+%26+Kitchen/@-6.3255424,106.8499976,17z/data=!3m1!4b1!4m6!3m5!1s0x2e69ed6693ff5185:0x1c9f23e0c402a4b5!8m2!3d-6.3255424!4d106.8499976!16s%2Fg%2F11qmqz_r4b?hl=id"
        print("1. Opening Google Maps...")
        page.goto(target_url, wait_until='domcontentloaded', timeout=30000)
        page.wait_for_timeout(3000)

        # Click photo button
        photo_btn = None
        for b in page.query_selector_all('button'):
            label = b.get_attribute('aria-label') or ''
            text = b.inner_text() or ''
            if ('Foto' in label and 'Homie' in label) or 'Lihat foto' in text:
                photo_btn = b
                break

        if photo_btn:
            print("2. Opening photo gallery...")
            photo_btn.click()
            page.wait_for_timeout(4000)

        # List of tabs to iterate through
        target_tabs = ['Semua', 'Terbaru', 'Makanan & minuman', 'Suasana', 'Oleh pemilik', 'Nacho']
        
        tab_buttons = page.query_selector_all('button[role="tab"], div[role="tab"], button')
        available_tabs = {}
        for b in tab_buttons:
            t = (b.inner_text() or b.get_attribute('aria-label') or '').strip()
            if t in target_tabs:
                available_tabs[t] = b

        print(f"3. Found target tabs: {list(available_tabs.keys())}")

        def scroll_active_gallery(max_scrolls=35):
            last_count = len(raw_urls)
            no_new_count = 0
            for s in range(max_scrolls):
                page.evaluate("""() => {
                    const scrollables = Array.from(document.querySelectorAll('div, main, section')).filter(el => {
                        const style = window.getComputedStyle(el);
                        return (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
                    });
                    scrollables.forEach(el => {
                        el.scrollTop = el.scrollHeight;
                    });
                }""")
                page.keyboard.press('PageDown')
                page.wait_for_timeout(600)

                # Collect from DOM
                dom_imgs = page.evaluate("""() => {
                    const urls = [];
                    document.querySelectorAll('*').forEach(el => {
                        if (el.tagName === 'IMG' && el.src) urls.push(el.src);
                        const bg = window.getComputedStyle(el).backgroundImage;
                        if (bg && bg.includes('googleusercontent.com')) {
                            const m = bg.match(/url\\(["']?(https?:\\/\\/[^"']+)["']?\\)/);
                            if (m) urls.push(m[1]);
                        }
                    });
                    return urls;
                }""")
                for img in dom_imgs:
                    if 'googleusercontent.com' in img and not re.search(r'/a[a-z0-9\-]*/', img):
                        raw_urls.add(img)

                curr_count = len(raw_urls)
                if curr_count == last_count:
                    no_new_count += 1
                    if no_new_count >= 5:
                        break
                else:
                    no_new_count = 0
                    last_count = curr_count

        # Iterate through tabs
        for tab_name, tab_el in available_tabs.items():
            print(f"\n--- Scanning tab: {tab_name} ---")
            try:
                tab_el.click()
                page.wait_for_timeout(2000)
                scroll_active_gallery(max_scrolls=40)
                print(f"Total raw URLs captured after {tab_name}: {len(raw_urls)}")
            except Exception as e:
                print(f"Error on tab {tab_name}: {e}")

        # Extract unique base photo URLs
        # Format: https://lh3.googleusercontent.com/...=... or /p/...
        unique_photos = {}
        for url in raw_urls:
            # Clean url
            clean = url.split('=')[0]
            if '/p/' in clean or '/gps-cs-s/' in clean:
                unique_photos[clean] = clean + '=s0'

        print(f"\n==========================================")
        print(f"TOTAL UNIQUE FULL-RES PHOTOS FOUND: {len(unique_photos)}")
        print(f"==========================================")

        # Save list to json
        out_file = "D:/assets/photos_list.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(list(unique_photos.values()), f, indent=2)
        print(f"Saved photo URLs list to {out_file}")

        browser.close()

if __name__ == '__main__':
    run()
