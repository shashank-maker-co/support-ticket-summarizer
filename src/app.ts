import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * A simple LLM wrapper app that summarizes customer support tickets
 * This represents a real-world use case
 */
export class SupportTicketSummarizer {
    private client: Anthropic;
    private model: string;
    private systemPrompt: string;

    constructor(options?: {
        client?: Anthropic;
        model?: string;
        systemPrompt?: string;
    }) {
        this.client = options?.client || new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        this.model = options?.model || "claude-3-haiku-20240307";
        this.systemPrompt = options?.systemPrompt ||
            "You are a helpful customer support assistant. Summarize support tickets concisely, highlighting the main issue and any action items.";
    }

    /**
     * Main application logic: summarize a support ticket
     */
    async summarize(ticket: {
        title: string;
        description: string;
        customerEmail: string;
    }): Promise<{
        summary: string;
        priority: "low" | "medium" | "high";
        suggestedAction: string;
    }> {
        const prompt = `
Title: ${ticket.title}
Customer: ${ticket.customerEmail}
Description: ${ticket.description}

Please provide:
1. A brief summary (1-2 sentences)
2. Priority level (low/medium/high)
3. Suggested action for the support team

Format your response as JSON.
`;

        const response = await this.client.messages.create({
            model: this.model,
            max_tokens: 500,
            system: this.systemPrompt,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const textContent = response.content.find(block => block.type === 'text');
        const responseText = textContent ? textContent.text.trim() : "";

        // Parse the JSON response
        try {
            const parsed = JSON.parse(responseText);
            return {
                summary: parsed.summary || parsed.Summary || "",
                priority: parsed.priority || parsed.Priority || "medium",
                suggestedAction: parsed.suggestedAction || parsed.suggested_action || parsed.action || "",
            };
        } catch (e) {
            // Fallback if JSON parsing fails
            return {
                summary: responseText,
                priority: "medium",
                suggestedAction: "Review ticket manually",
            };
        }
    }

    /**
     * Batch processing for multiple tickets
     */
    async summarizeBatch(tickets: Array<{
        title: string;
        description: string;
        customerEmail: string;
    }>): Promise<Array<{
        summary: string;
        priority: "low" | "medium" | "high";
        suggestedAction: string;
    }>> {
        return Promise.all(tickets.map(ticket => this.summarize(ticket)));
    }
}
