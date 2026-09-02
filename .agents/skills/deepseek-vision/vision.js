#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');

function getApiKey() {
  if (process.env.DEEPSEEK_API_KEY) return process.env.DEEPSEEK_API_KEY;
  const authPath = path.join(os.homedir(), '.pi', 'agent', 'auth.json');
  if (fs.existsSync(authPath)) {
    try {
      const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
      if (auth.deepseek) {
        if (typeof auth.deepseek === 'string') return auth.deepseek;
        return auth.deepseek.key || auth.deepseek.apiKey || auth.deepseek.token || null;
      }
    } catch {}
  }
  return null;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    default:
      return 'image/jpeg';
  }
}

function fileToDataUrl(filePath) {
  const resolved = path.resolve(process.cwd(), filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Image file not found: ${resolved}`);
  }
  const buffer = fs.readFileSync(resolved);
  const mime = getMimeType(resolved);
  const base64 = buffer.toString('base64');
  return `data:${mime};base64,${base64}`;
}

function printUsage() {
  console.log(`
DeepSeek Vision CLI

Usage:
  node vision.js <image-path-or-url...> [options]

Options:
  -p, --prompt <text>      Prompt/instruction for the image (default: "Describe this image in detail.")
  -m, --model <name>       Model ID (default: "deepseek-v4-flash-vision-exp")
  -d, --detail <level>     Image detail level: "auto", "low", "high", "original" (default: "auto")
  -s, --system <text>      Optional system instruction
  --show-thinking          Include model reasoning / chain of thought in the output
  --json                   Output full JSON response from DeepSeek API
  -h, --help               Show this help message

Examples:
  node vision.js ./screenshot.png -p "Extract text and convert to markdown"
  node vision.js ./ui-mockup.png -p "Convert this UI mockup to Tailwind HTML code"
  node vision.js ./chart.jpg -p "Summarize key trends in this chart"
  node vision.js https://example.com/photo.jpg -p "Describe this photo"
  node vision.js img1.png img2.png -p "Compare differences between these two images"
`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printUsage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    console.error('Error: DeepSeek API key not found in DEEPSEEK_API_KEY environment variable or ~/.pi/agent/auth.json');
    process.exit(1);
  }

  let prompt = 'Describe this image in detail.';
  let model = 'deepseek-v4-flash-vision-exp';
  let detail = 'auto';
  let systemPrompt = '';
  let showThinking = false;
  let rawJson = false;
  const imageInputs = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-p' || arg === '--prompt') {
      prompt = args[++i] || prompt;
    } else if (arg === '-m' || arg === '--model') {
      model = args[++i] || model;
    } else if (arg === '-d' || arg === '--detail') {
      detail = args[++i] || detail;
    } else if (arg === '-s' || arg === '--system') {
      systemPrompt = args[++i] || '';
    } else if (arg === '--show-thinking') {
      showThinking = true;
    } else if (arg === '--json') {
      rawJson = true;
    } else if (!arg.startsWith('-')) {
      imageInputs.push(arg);
    }
  }

  if (imageInputs.length === 0) {
    console.error('Error: No image file or URL provided.');
    process.exit(1);
  }

  const content = [];
  content.push({ type: 'text', text: prompt });

  for (const img of imageInputs) {
    let imageUrl;
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
      imageUrl = img;
    } else {
      try {
        imageUrl = fileToDataUrl(img);
      } catch (err) {
        console.error(`Error loading image: ${err.message}`);
        process.exit(1);
      }
    }

    const imageObj = { url: imageUrl };
    if (detail && detail !== 'auto') {
      imageObj.detail = detail;
    }
    content.push({ type: 'image_url', image_url: imageObj });
  }

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content });

  const payload = {
    model,
    messages
  };

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DeepSeek API Error (${response.status}): ${errorText}`);
      process.exit(1);
    }

    const data = await response.json();

    if (rawJson) {
      console.log(JSON.stringify(data, null, 2));
      return;
    }

    const choice = data.choices && data.choices[0];
    if (!choice || !choice.message) {
      console.error('Unexpected API response format:', JSON.stringify(data));
      process.exit(1);
    }

    if (showThinking && choice.message.reasoning_content) {
      console.log('--- Thinking Process ---');
      console.log(choice.message.reasoning_content);
      console.log('--- End of Thinking ---\n');
    }

    console.log(choice.message.content || '');
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    process.exit(1);
  }
}

main();
