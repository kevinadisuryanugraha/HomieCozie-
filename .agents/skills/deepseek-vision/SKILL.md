---
name: deepseek-vision
description: Visual analysis, OCR, screenshot-to-code, diagram inspection, UI review, and chart interpretation using DeepSeek Vision API (deepseek-v4-flash-vision-exp). Use when you need to inspect images, extract text/tables from screenshots, diagnose error screenshots, compare UI designs, or convert image mockups to code.
---

# DeepSeek Vision Skill

Skill for visual understanding and image-based tasks powered by DeepSeek's multimodal vision model (`deepseek-v4-flash-vision-exp`). Uses the configured DeepSeek API key automatically from `DEEPSEEK_API_KEY` or `~/.pi/agent/auth.json`.

## Capabilities

- **OCR & Document Extraction**: Extract text, tables, and structured data from screenshots or scanned files.
- **UI Mockup to Code**: Inspect design screenshots and generate matching HTML/CSS/Tailwind/React code.
- **Error & Debug Diagnosis**: Analyze error screenshots, terminal captures, or stack trace images.
- **Chart & Diagram Analysis**: Understand workflows, architecture diagrams, sequence charts, and metric graphs.
- **Multi-Image Comparison**: Compare two or more images side-by-side (e.g. before/after, design vs implementation).

## Supported Formats & Limits

- **Image Formats**: JPEG, PNG, GIF, WebP (local files or external HTTP/HTTPS URLs).
- **Detail Levels**: `low` (downscaled to 512×512 for fast/budget processing), `high` / `original` (preserves full resolution), or `auto`.
- **Max Image Size**: Up to 32 MiB per inline image, max 48 MiB total payload, up to 600 images per request.

---

## Usage

Helper script location: `vision.js` (in this skill directory).

### Basic Command

```bash
node <skill-dir>/vision.js <image-path-or-url> -p "<prompt>"
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `-p`, `--prompt <text>` | Question or instruction for the model | `"Describe this image in detail."` |
| `-m`, `--model <name>` | DeepSeek vision model name | `deepseek-v4-flash-vision-exp` |
| `-d`, `--detail <level>` | Detail level: `auto`, `low`, `high`, `original` | `auto` |
| `-s`, `--system <text>` | System prompt instruction | None |
| `--show-thinking` | Display reasoning / chain-of-thought trace | `false` |
| `--json` | Output raw JSON response from API | `false` |

---

## Common Workflows

### 1. Extract Text / OCR from Screenshot
```bash
node vision.js screenshot.png -p "Extract all visible text exactly as written. Format tables in Markdown."
```

### 2. Convert UI Screenshot to Code
```bash
node vision.js mockup.png -p "Convert this UI design into clean semantic HTML with Tailwind CSS classes. Make it responsive."
```

### 3. Diagnose Error Screenshot
```bash
node vision.js error.png -p "What error is shown in this screenshot, what causes it, and how do I fix it?"
```

### 4. Analyze Architecture or Flowchart Diagram
```bash
node vision.js architecture.png -p "Explain the architecture diagram in detail, listing each component and data flow."
```

### 5. Compare Multiple Images (Design vs Code)
```bash
node vision.js figma_design.png implementation.png -p "Compare these two images: the first is the target design, the second is the actual implementation. List visual discrepancies and styling differences."
```

### 6. Fast / Low Token Analysis
```bash
node vision.js photo.jpg -d low -p "Is there any text or warning sign in this picture?"
```
