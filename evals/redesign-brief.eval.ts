import { Eval } from "braintrust";
import dotenv from "dotenv";
import { testCases } from "./fixtures/test-cases";
import {
    sectionCompletenessScorer,
    keywordRelevanceScorer,
    colorSpecificityScorer,
    typographyScorer,
    comprehensivenessScorer,
    markdownQualityScorer,
    actionabilityScorer
} from "./scorers";

dotenv.config();

/**
 * Evaluation: Website Redesign Brief Generator
 *
 * Tests the quality of AI-generated redesign briefs across different scenarios
 */

// Helper function to call the worker
async function generateBrief(input: any) {
    const response = await fetch('http://localhost:8787', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
    });

    const data = await response.json();
    return data.brief;
}

Eval(
    "Website Redesign Brief Generator - Quality Evaluation",
    {
        projectId: "26c545b6-4f9b-4ce4-8b77-684cb942f0d7",
        data: () => testCases,

        task: async ({ input }) => {
            const brief = await generateBrief(input);
            return brief;
        },

        scores: [
            {
                name: "Has Required Sections",
                scorer: sectionCompletenessScorer
            },
            {
                name: "Mentions Key Topics",
                scorer: keywordRelevanceScorer
            },
            {
                name: "Provides Color Recommendations",
                scorer: colorSpecificityScorer
            },
            {
                name: "Suggests Typography",
                scorer: typographyScorer
            },
            {
                name: "Sufficient Detail",
                scorer: comprehensivenessScorer
            },
            {
                name: "Well-Formatted",
                scorer: markdownQualityScorer
            },
            {
                name: "Includes Implementation Prompt",
                scorer: actionabilityScorer
            }
        ],

        maxConcurrency: 1, // Run one at a time to avoid rate limits
    }
);
