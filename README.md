# Company Snapshot Flow

### 1. Extraction

```bash
# Extract the downloaded .zip file, then:
cd company-snapshot-flow
```

### 2. Dependencies & environment variables

```bash
npm install
# or
pnpm install
# or
yarn install
```


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


### 3. Run the Flow

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The flow will execute and display results in your terminal.

Apache-2.0 © Bubble Lab, Inc.

---

**Happy Building! 🫧**
