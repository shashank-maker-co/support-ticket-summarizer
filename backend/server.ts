import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { SupportTicketSummarizer } from "../src/app";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the app
const summarizer = new SupportTicketSummarizer({
    client: new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    }),
    model: "claude-3-haiku-20240307",
});

// Types
interface TicketRequest {
    title: string;
    description: string;
    customerEmail: string;
}

// Routes
app.post("/api/summarize", async (req: Request, res: Response) => {
    try {
        const ticket: TicketRequest = req.body;

        // Validate input
        if (!ticket.title || !ticket.description || !ticket.customerEmail) {
            return res.status(400).json({
                error: "Missing required fields: title, description, customerEmail",
            });
        }

        // Process ticket
        const result = await summarizer.summarize(ticket);

        res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Error processing ticket:", error);
        res.status(500).json({
            success: false,
            error: "Failed to process ticket",
        });
    }
});

app.post("/api/summarize-batch", async (req: Request, res: Response) => {
    try {
        const tickets: TicketRequest[] = req.body.tickets;

        if (!Array.isArray(tickets) || tickets.length === 0) {
            return res.status(400).json({
                error: "Invalid request: tickets must be a non-empty array",
            });
        }

        const results = await summarizer.summarizeBatch(tickets);

        res.json({
            success: true,
            data: results,
        });
    } catch (error) {
        console.error("Error processing batch:", error);
        res.status(500).json({
            success: false,
            error: "Failed to process tickets",
        });
    }
});

// Health check
app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   POST /api/summarize`);
    console.log(`   POST /api/summarize-batch`);
    console.log(`   GET  /api/health`);
});
