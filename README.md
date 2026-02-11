# Company Snapshot Flow

**A complete, ready-to-run BubbleFlow project exported from BubbleLab Studio.**

This is a standalone Node.js project with all dependencies, configuration files, and your flow code pre-configured. Just extract, install, and run!

## 📦 What's Included

- **Complete project structure** with TypeScript configuration
- **All required dependencies** (`@bubblelab/bubble-core`, `@bubblelab/bubble-runtime`)
- **Your flow code** in `src/company_snapshot_flow.ts`
- **Runner script** that executes your flow locally
- **Environment template** (with your required credentials)
- **Development tools** (tsx for fast development, TypeScript compiler)

## 🚀 Quick Start

### 1. Extract and Navigate

```bash
# Extract the downloaded .zip file, then:
cd company-snapshot-flow
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

This installs all required packages including `@bubblelab/bubble-core` and `@bubblelab/bubble-runtime`.

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your API keys and credentials:

- **FIRE_CRAWL_API_KEY**: Firecrawl API Key - Get at https://www.firecrawl.dev/
- **OPENAI_API_KEY**: OpenAI API Key - Get at https://platform.openai.com/api-keys
- **GOOGLE_API_KEY**: Google Gemini API Key - Get at https://aistudio.google.com/app/apikey
- **ANTHROPIC_API_KEY**: Anthropic API Key - Get at https://console.anthropic.com/
- **OPENROUTER_API_KEY**: OpenRouter API Key - Get at https://openrouter.ai/keys
- **APIFY_API_TOKEN**: APIFY_CRED credential
- **RESEND_API_KEY**: Resend API Key - Get at https://resend.com/api-keys


### 4. Run the Flow

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The flow will execute and display results in your terminal.

## 📚 Project Structure

```
company-snapshot-flow/
├── src/
│   ├── index.ts           # Flow runner (executes the flow)
│   └── company_snapshot_flow.ts    # Your flow definition
├── package.json
├── tsconfig.json
├── .env.example          # Environment variables template
└── README.md
```

## 🔧 Customization

### Modify Flow Parameters

Edit `src/index.ts` to dynamically change bubble parameters before execution:

```typescript
// Get the bubble IDs
const bubbleIds = Object.keys(bubbles).map(Number);

// Change a parameter value
runner.injector.changeBubbleParameters(
  bubbleIds[0],  // Bubble ID
  'message',     // Parameter name
  'New value'    // New value
);
```

### Add More Flows

Create additional flow files in `src/` and import them in `index.ts`.

## 📖 Learn More

- [BubbleLab Documentation](https://github.com/bubblelabai/BubbleLab)
- [BubbleLab Studio](https://bubblelab.dev)

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/bubblelabai/BubbleLab/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bubblelabai/BubbleLab/discussions)

## 📄 License

Apache-2.0 © Bubble Lab, Inc.

---

**Happy Building! 🫧**
