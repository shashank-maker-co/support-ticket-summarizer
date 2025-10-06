import { Eval, wrapAnthropic } from "braintrust";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Anthropic client with Braintrust wrapper for automatic logging
const client = wrapAnthropic(
    new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    }),
);

Eval(
    "Question Answering Experiment",
    {
        projectId: "26c545b6-4f9b-4ce4-8b77-684cb942f0d7",
        data: () => {
            return [
                {
                    input: "What is the capital of France?",
                    expected: "Paris",
                },
                {
                    input: "What is 2 + 2?",
                    expected: "4",
                },
                {
                    input: "Who wrote Romeo and Juliet?",
                    expected: "William Shakespeare",
                },
            ];
        },
        task: async (input) => {
            const response = await client.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 50,
                messages: [
                    {
                        role: "user",
                        content: `Answer this question briefly and directly: ${input}`,
                    },
                ],
            });

            // Handle the content properly - it's an array of content blocks
            const textContent = response.content.find(block => block.type === 'text');
            return textContent ? textContent.text.trim() : "";
        },
        scores: [
            // Custom accuracy scorer - checks if the answer contains the expected result
            (args: { output: string; expected: string }) => {
                const output = args.output.toLowerCase();
                const expected = args.expected.toLowerCase();
                const score = output.includes(expected) ? 1 : 0;
                return {
                    name: "Contains Expected",
                    score: score,
                };
            },
        ],
        maxConcurrency: 2,
    },
);