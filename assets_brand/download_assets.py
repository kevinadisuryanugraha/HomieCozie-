import os
import sys
import json
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image
import io

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR = r"D:\assets"
PHOTOS_DIR = os.path.join(BASE_DIR, "photos")
os.makedirs(PHOTOS_DIR, exist_ok=True)

# Load collected photo URLs
json_file = os.path.join(BASE_DIR, "photos_list.json")
if not os.path.exists(json_file):
    print("Error: photos_list.json not found.")
    sys.exit(1)

with open(json_file, "r", encoding="utf-8") as f:
    photo_urls = json.load(f)

print(f"Total photos to download: {len(photo_urls)}")

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

def download_photo(idx, url):
    base_url = url.split('=')[0]
    # Try high resolution params in order: =s0 (original max), =s2048, =w2048-h2048, or fallback to given url
    candidates = [base_url + '=s0', base_url + '=s2048', base_url + '=w2048-h2048', url]
    
    file_path = os.path.join(PHOTOS_DIR, f"homie_cozie_{idx:03d}.jpg")
    
    for candidate_url in candidates:
        try:
            resp = requests.get(candidate_url, headers=headers, timeout=20)
            if resp.status_code == 200 and len(resp.content) > 1000:
                # verify image with PIL
                img = Image.open(io.BytesIO(resp.content))
                img_format = img.format.lower() if img.format else 'jpg'
                if img_format == 'jpeg':
                    img_format = 'jpg'
                
                final_path = os.path.join(PHOTOS_DIR, f"homie_cozie_{idx:03d}.{img_format}")
                with open(final_path, "wb") as f:
                    f.write(resp.content)
                
                return {
                    "index": idx,
                    "filename": f"homie_cozie_{idx:03d}.{img_format}",
                    "resolution": f"{img.width}x{img.height}",
                    "size_bytes": len(resp.content),
                    "url": candidate_url,
                    "status": "success"
                }
        except Exception as e:
            continue
            
    return {
        "index": idx,
        "filename": f"homie_cozie_{idx:03d}.jpg",
        "resolution": "unknown",
        "size_bytes": 0,
        "url": url,
        "status": "failed"
    }

results = []
start_time = time.time()

print(f"Starting parallel download with 10 workers...")
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(download_photo, i + 1, url): i + 1 for i, url in enumerate(photo_urls)}
    for future in as_completed(futures):
        res = future.result()
        results.append(res)
        if res["status"] == "success":
            print(f"[{len(results)}/{len(photo_urls)}] OK: {res['filename']} ({res['resolution']}, {res['size_bytes']/1024:.1f} KB)")
        else:
            print(f"[{len(results)}/{len(photo_urls)}] FAILED: homie_cozie_{res['index']:03d}")

results.sort(key=lambda x: x["index"])

# Save metadata json
metadata_file = os.path.join(BASE_DIR, "photos_metadata.json")
with open(metadata_file, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

success_count = sum(1 for r in results if r["status"] == "success")
total_size_mb = sum(r["size_bytes"] for r in results) / (1024 * 1024)
elapsed = time.time() - start_time

print(f"\n==========================================")
print(f"DOWNLOAD COMPLETE!")
print(f"Total Downloaded: {success_count}/{len(photo_urls)} photos")
print(f"Total Size: {total_size_mb:.2f} MB")
print(f"Elapsed Time: {elapsed:.2f} seconds")
print(f"Metadata saved to: {metadata_file}")
print(f"==========================================")
