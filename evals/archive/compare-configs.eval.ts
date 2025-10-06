import { Eval, wrapAnthropic } from "braintrust";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { SupportTicketSummarizer } from "../src/app";

dotenv.config();

/**
 * Advanced Example: Compare different app configurations
 * Test how different models, prompts, or settings affect your app's performance
 */

const testData = [
    {
        input: {
            title: "Refund request - defective product",
            description: "The laptop I received has a broken screen. I want a full refund immediately.",
            customerEmail: "angry.customer@email.com",
        },
        expected: {
            priority: "high",
            shouldMentionRefund: true,
        },
    },
    {
        input: {
            title: "How do I export data?",
            description: "I'm trying to export my data to CSV but can't find the button.",
            customerEmail: "newuser@company.com",
        },
        expected: {
            priority: "low",
            shouldMentionRefund: false,
        },
    },
];

// Configuration 1: Fast model with standard prompt
Eval(
    "Config A: Haiku Model (Fast & Cheap)",
    {
        projectId: "26c545b6-4f9b-4ce4-8b77-684cb942f0d7",
        data: () => testData,
        task: async (input) => {
            const app = new SupportTicketSummarizer({
                client: wrapAnthropic(
                    new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
                ),
                model: "claude-3-haiku-20240307",
            });
            return app.summarize(input);
        },
        scores: [
            (args: { output: any; expected: any }) => ({
                name: "Priority Accuracy",
                score: args.output.priority === args.expected.priority ? 1 : 0,
            }),
        ],
    }
);

// Configuration 2: Better model for improved accuracy
Eval(
    "Config B: Sonnet Model (Balanced)",
    {
        projectId: "26c545b6-4f9b-4ce4-8b77-684cb942f0d7",
        data: () => testData,
        task: async (input) => {
            const app = new SupportTicketSummarizer({
                client: wrapAnthropic(
                    new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
                ),
                model: "claude-3-5-sonnet-20241022",
            });
            return app.summarize(input);
        },
        scores: [
            (args: { output: any; expected: any }) => ({
                name: "Priority Accuracy",
                score: args.output.priority === args.expected.priority ? 1 : 0,
            }),
        ],
    }
);

// Configuration 3: Custom system prompt
Eval(
    "Config C: Custom Empathetic Prompt",
    {
        projectId: "26c545b6-4f9b-4ce4-8b77-684cb942f0d7",
        data: () => testData,
        task: async (input) => {
            const app = new SupportTicketSummarizer({
                client: wrapAnthropic(
                    new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
                ),
                model: "claude-3-haiku-20240307",
                systemPrompt: `You are an empathetic customer support assistant. When summarizing tickets:
- Always acknowledge the customer's emotions
- Prioritize issues that show customer frustration as HIGH
- Be specific about action items
- Keep summaries concise but compassionate`,
            });
            return app.summarize(input);
        },
        scores: [
            (args: { output: any; expected: any }) => ({
                name: "Priority Accuracy",
                score: args.output.priority === args.expected.priority ? 1 : 0,
            }),
            (args: { output: any }) => {
                const hasEmpathy = args.output.summary.match(/customer|issue|concern/i);
                return {
                    name: "Empathetic Language",
                    score: hasEmpathy ? 1 : 0,
                };
            },
        ],
    }
);
