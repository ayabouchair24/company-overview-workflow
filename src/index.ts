/**
 * BubbleFlow Runner
 *
 * This file executes your BubbleFlow locally using the BubbleRunner.
 *
 * Quick Start:
 * 1. Make sure you've run 'npm install' to install dependencies
 * 2. Configure your .env file with required credentials (copy from .env.example)
 * 3. Run 'npm run dev' to execute this flow
 *
 * You can customize bubble parameters and credentials below before execution.
 */

import { BubbleRunner } from '@bubblelab/bubble-runtime';
import { BubbleFactory } from '@bubblelab/bubble-core';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { CredentialType } from '@bubblelab/shared-schemas';

// Load environment variables from .env file
config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('🫧 Starting BubbleFlow execution\n');

  // Step 1: Create a BubbleFactory and register defaults
  const bubbleFactory = new BubbleFactory();
  await bubbleFactory.registerDefaults();
  console.log('✅ BubbleFactory initialized\n');

  // Step 2: Read the flow code as a string
  const flowCode = readFileSync(join(__dirname, 'company_snapshot_flow.ts'), 'utf-8');

  // Step 3: Create a BubbleRunner with your flow code
  const runner = new BubbleRunner(flowCode, bubbleFactory);

  // Step 4: Get parsed bubbles for credential injection
  const bubbles = runner.getParsedBubbles();

  // Inject credentials from environment variables
  runner.injector.injectCredentials(bubbles, [], {
    [CredentialType.FIRECRAWL_API_KEY]: process.env.FIRE_CRAWL_API_KEY,
    [CredentialType.OPENAI_CRED]: process.env.OPENAI_API_KEY,
    [CredentialType.GOOGLE_GEMINI_CRED]: process.env.GOOGLE_API_KEY,
    [CredentialType.ANTHROPIC_CRED]: process.env.ANTHROPIC_API_KEY,
    [CredentialType.OPENROUTER_CRED]: process.env.OPENROUTER_API_KEY,
    [CredentialType.APIFY_CRED]: process.env.APIFY_API_TOKEN,
    [CredentialType.RESEND_CRED]: process.env.RESEND_API_KEY,
  });

  // Step 5: (Optional) Modify bubble parameters dynamically
  // Example: Change a parameter value
  // const bubbleIds = Object.keys(bubbles).map(Number);
  // if (bubbleIds.length > 0) {
  //   runner.injector.changeBubbleParameters(
  //     bubbleIds[0],
  //     'parameterName',
  //     'new value'
  //   );
  // }

  // Step 6: Execute the flow with payload
  // Example payload generated from your flow's input schema
  // Modify this to match your actual data
  const payload = {
  "companyName": "sample_oruqjn6h",
  "recipientEmail": "sample_oa31q0vdl5",
  "linkedinUsername": "sample_mvqbrz"
};

  console.log('🤖 Running flow...\n');
  const result = await runner.runAll(payload);

  // Step 7: Display results
  console.log('📊 Results:');
  console.log('─'.repeat(50));
  console.log(JSON.stringify(result, null, 2));
  console.log('─'.repeat(50));

  // Optional: View execution logs
  const logs = runner.getLogger()?.getLogs();
  if (logs && logs.length > 0) {
    console.log('\n📝 Execution Logs:');
    console.log(logs.slice(0, 5)); // Show first 5 logs
  }

  // Optional: View execution summary
  const summary = runner.getLogger()?.getExecutionSummary();
  if (summary) {
    console.log('\n📈 Execution Summary:');
    console.log(summary);
  }

  // Force exit to close any lingering connections
  process.exit(0);
}

// Run the flow
main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
