import Anthropic from "@anthropic-ai/sdk";
import { wrapAnthropic, initLogger } from "braintrust";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Braintrust logger and Anthropic client
const client = wrapAnthropic(
    new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    }),
);
const logger = initLogger({
    projectName: "My Project",
    apiKey: process.env.BRAINTRUST_API_KEY,
});

// Enter your prompt call here
async function main() {
    const result = await client.messages.create({
        messages: [
            {
                role: "user",
                content: "What is 1+1?",
            },
        ],
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
    });
}

main();