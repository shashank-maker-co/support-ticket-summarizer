import { Eval, wrapAnthropic } from "braintrust";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import { SupportTicketSummarizer } from "../src/app";

dotenv.config();

/**
 * Real-world evaluation: Test your actual application logic
 * This hooks into your SupportTicketSummarizer app and tests it end-to-end
 */

// Test data representing real support tickets
const testTickets = [
    {
        input: {
            title: "Can't login to account",
            description: "I've been trying to login for the past hour but keep getting 'Invalid credentials' error. I reset my password twice already. Please help!",
            customerEmail: "john.doe@example.com",
        },
        expected: {
            priority: "high",
            summaryContains: ["login", "credentials"],
            actionContains: ["reset", "account"],
        },
    },
    {
        input: {
            title: "Question about billing",
            description: "I was charged $99 but my plan should be $79/month. Can you explain the difference?",
            customerEmail: "jane.smith@example.com",
        },
        expected: {
            priority: "medium",
            summaryContains: ["billing", "charge"],
            actionContains: ["invoice", "billing"],
        },
    },
    {
        input: {
            title: "Feature request",
            description: "It would be great if you could add dark mode to the dashboard.",
            customerEmail: "user@test.com",
        },
        expected: {
            priority: "low",
            summaryContains: ["feature", "dark mode"],
            actionContains: ["product", "team"],
        },
    },
    {
        input: {
            title: "URGENT: Payment processing down",
            description: "Our entire payment system is not processing any transactions. We're losing money every minute. CRITICAL ISSUE!",
            customerEmail: "ceo@bigclient.com",
        },
        expected: {
            priority: "high",
            summaryContains: ["payment", "critical"],
            actionContains: ["urgent", "immediate"],
        },
    },
];

Eval(
    "Support Ticket Summarizer - Production App Test",
    {
        projectId: "26c545b6-4f9b-4ce4-8b77-684cb942f0d7",
        data: () => testTickets,

        task: async (input) => {
            // Initialize your app with Braintrust-wrapped client for automatic logging
            const app = new SupportTicketSummarizer({
                client: wrapAnthropic(
                    new Anthropic({
                        apiKey: process.env.ANTHROPIC_API_KEY,
                    })
                ),
                model: "claude-3-haiku-20240307", // Can test different models
            });

            // Call your actual app logic
            const result = await app.summarize(input);
            return result;
        },

        scores: [
            // Score 1: Check if priority is correct
            (args: { output: any; expected: any }) => {
                const correctPriority = args.output.priority === args.expected.priority;
                return {
                    name: "Correct Priority",
                    score: correctPriority ? 1 : 0,
                };
            },

            // Score 2: Check if summary contains key terms
            (args: { output: any; expected: any }) => {
                const summary = args.output.summary.toLowerCase();
                const containsAll = args.expected.summaryContains.every(
                    (term: string) => summary.includes(term.toLowerCase())
                );
                return {
                    name: "Summary Quality",
                    score: containsAll ? 1 : 0.5,
                };
            },

            // Score 3: Check if suggested action is relevant
            (args: { output: any; expected: any }) => {
                const action = args.output.suggestedAction.toLowerCase();
                const hasRelevantAction = args.expected.actionContains.some(
                    (term: string) => action.includes(term.toLowerCase())
                );
                return {
                    name: "Action Relevance",
                    score: hasRelevantAction ? 1 : 0,
                };
            },

            // Score 4: Check response completeness
            (args: { output: any }) => {
                const hasAllFields =
                    args.output.summary &&
                    args.output.priority &&
                    args.output.suggestedAction;
                return {
                    name: "Response Completeness",
                    score: hasAllFields ? 1 : 0,
                };
            },
        ],

        maxConcurrency: 2,
    }
);
