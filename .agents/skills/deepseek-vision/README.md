# DeepSeek Vision Skill for Pi Coding Agent

A multimodal vision skill and CLI tool powered by DeepSeek's vision model (`deepseek-v4-flash-vision-exp`).

Enables visual understanding, OCR text extraction, UI-to-code slicing, error screenshot diagnostics, and chart analysis directly in [Pi Coding Agent](https://github.com/earendil-works/pi) or as a standalone CLI.

---

## Features

- 🖼️ **Visual Understanding & OCR**: Extract text, markdown tables, and data from screenshots and images.
- 🎨 **UI Mockup to Code**: Inspect design screenshots and generate matching HTML / Tailwind CSS / React components.
- 🐞 **Error Screenshot Diagnostics**: Analyze terminal errors, trace logs, or application crash screenshots.
- 📊 **Charts & Diagrams**: Interpret architecture diagrams, flowcharts, and metric graphs.
- ⚖️ **Multi-Image Comparison**: Compare UI designs vs actual implementations or before/after diffs.
- ⚡ **Zero Dependencies**: Pure native Node.js (Node >= 18). No `npm install` needed.
- 🔑 **Auto Key Detection**: Automatically picks up your DeepSeek API key from `DEEPSEEK_API_KEY` or `~/.pi/agent/auth.json`.

---

## Installation for Pi Coding Agent

### Option 1: Copy to Global Skills Folder (Recommended)

Clone or copy this folder into your Pi skills directory:

```bash
git clone https://github.com/dhayufs/pi-deepseek-vision.git ~/.pi/agent/skills/deepseek-vision
```

Or on Windows:
```bash
git clone https://github.com/dhayufs/pi-deepseek-vision.git C:\Users\<Username>\.pi\agent\skills\deepseek-vision
```

### Option 2: Project-Level Skill

Copy into your project directory:
```bash
mkdir -p .pi/skills
cp -r /path/to/deepseek-vision .pi/skills/
```

Then in your Pi session, run:
```
/reload
```
You can now invoke `/skill:deepseek-vision` or simply ask the agent to inspect any image!

---

## Standalone CLI Usage

You can also use `vision.js` directly from your terminal:

```bash
# Basic description
node vision.js screenshot.png -p "What is in this image?"

# OCR text extraction
node vision.js document.png -p "Extract all text and tables in Markdown format."

# Convert UI design to Tailwind CSS
node vision.js mockup.png -p "Generate responsive HTML with Tailwind CSS for this design."

# Error diagnosis
node vision.js error.png -p "What is causing this error and how do I fix it?"

# Compare two images
node vision.js design.png actual.png -p "Compare design vs implementation differences."

# Show thinking/reasoning process
node vision.js chart.png --show-thinking -p "Analyze trends in this chart."

# Low-token / fast mode
node vision.js photo.jpg -d low -p "Is there any text in this picture?"
```

---

## CLI Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --prompt <text>` | Prompt or instruction for the image | `"Describe this image in detail."` |
| `-m, --model <name>` | DeepSeek vision model | `deepseek-v4-flash-vision-exp` |
| `-d, --detail <level>` | Detail level: `auto`, `low`, `high`, `original` | `auto` |
| `-s, --system <text>` | Optional system instruction | None |
| `--show-thinking` | Display model's chain-of-thought reasoning | `false` |
| `--json` | Output raw JSON response from API | `false` |

---

## Supported Formats & Limits

- **Formats**: JPEG, PNG, GIF, WebP (local file paths or HTTP/HTTPS URLs).
- **Size**: Up to 32 MiB per inline image, max 48 MiB request body, up to 600 images per request.

---

## License

MIT
