import { Eval, wrapAnthropic } from "braintrust";
import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Evaluation: Website Redesign Brief Generator
 *
 * Tests the quality of AI-generated redesign briefs across different scenarios
 */

const testCases = [
    {
        name: "E-commerce - Handmade Jewelry",
        input: {
            websiteUrl: "example-jewelry.com",
            businessDescription: "Sell handmade jewelry online to young professionals",
            mainGoal: "Increase sales/conversions",
            targetAudience: "Young professionals (25-35)",
            notWorking: ["Looks outdated/unprofessional", "Not mobile-friendly", "Low conversions/poor CTAs"],
            isWorking: ["Good content", "Strong brand recognition"],
            desiredFeeling: "Premium & exclusive",
            visualStyle: "Modern & minimal",
            currentPlatform: "Shopify",
            inspirationSites: "https://mejuri.com, https://auratenewyork.com"
        },
        expected: {
            mustIncludeSections: ["Executive Summary", "Visual Design Direction", "Strategic Recommendations"],
            shouldMentionKeywords: ["mobile", "conversion", "premium", "trust", "checkout"],
            shouldHaveColors: true, // Should suggest specific hex codes
            shouldHaveFonts: true, // Should suggest specific typography
            minLength: 500, // Minimum words for comprehensive brief
        }
    },
    {
        name: "SaaS - Project Management Tool",
        input: {
            websiteUrl: "project-tool.io",
            businessDescription: "B2B project management software for remote teams",
            mainGoal: "Generate more leads",
            targetAudience: "Business decision-makers (35-55)",
            notWorking: ["Confusing navigation", "Hard to find information", "Poor visual design"],
            isWorking: ["Clear value proposition", "Good SEO"],
            desiredFeeling: "Professional & trustworthy",
            visualStyle: "Tech & futuristic",
            currentPlatform: "Custom/coded",
            inspirationSites: "https://linear.app, https://notion.so"
        },
        expected: {
            mustIncludeSections: ["Executive Summary", "Strategic Recommendations", "Priority Roadmap"],
            shouldMentionKeywords: ["navigation", "lead generation", "B2B", "demo", "trial"],
            shouldHaveColors: true,
            shouldHaveFonts: true,
            minLength: 500,
        }
    },
    {
        name: "Portfolio - Freelance Designer",
        input: {
            websiteUrl: "",
            businessDescription: "Freelance UX designer showcasing client work",
            mainGoal: "Build brand credibility",
            targetAudience: "Creative professionals",
            notWorking: ["Slow loading speed", "Cluttered layout"],
            isWorking: ["Strong brand recognition", "Good content"],
            desiredFeeling: "Creative & innovative",
            visualStyle: "Bold & colorful",
            currentPlatform: "Webflow",
            inspirationSites: ""
        },
        expected: {
            mustIncludeSections: ["Visual Design Direction", "Content & Messaging"],
            shouldMentionKeywords: ["portfolio", "case studies", "creative", "bold"],
            shouldHaveColors: true,
            shouldHaveFonts: true,
            minLength: 400,
        }
    },
    {
        name: "Minimal Input - New Restaurant",
        input: {
            websiteUrl: "",
            businessDescription: "New Italian restaurant in downtown",
            mainGoal: "Modernize outdated appearance",
            targetAudience: "",
            notWorking: [],
            isWorking: [],
            desiredFeeling: "",
            visualStyle: "",
            currentPlatform: "Wix",
            inspirationSites: ""
        },
        expected: {
            mustIncludeSections: ["Executive Summary"],
            shouldMentionKeywords: ["restaurant", "italian"],
            shouldHaveColors: true,
            shouldHaveFonts: false, // Minimal input, might not have typography
            minLength: 300, // Lower expectations for minimal input
        }
    },
    {
        name: "Agency - Marketing Consultancy",
        input: {
            websiteUrl: "marketing-agency.com",
            businessDescription: "B2B marketing consultancy helping startups scale",
            mainGoal: "Build brand credibility",
            targetAudience: "Business decision-makers (35-55)",
            notWorking: ["Looks outdated/unprofessional", "Low conversions/poor CTAs"],
            isWorking: ["Good content", "Clear value proposition", "Fast performance"],
            desiredFeeling: "Professional & trustworthy",
            visualStyle: "Classic & elegant",
            currentPlatform: "WordPress",
            inspirationSites: "https://metalab.com"
        },
        expected: {
            mustIncludeSections: ["Executive Summary", "Strategic Recommendations", "Technical Approach"],
            shouldMentionKeywords: ["trust", "credibility", "B2B", "case studies", "testimonials"],
            shouldHaveColors: true,
            shouldHaveFonts: true,
            minLength: 500,
        }
    }
];

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
            // Score 1: Section Completeness
            {
                name: "Has Required Sections",
                scorer: (args: { output: string; expected: any }) => {
                    const output = args.output.toLowerCase();
                    const missingCount = args.expected.mustIncludeSections.filter(
                        (section: string) => !output.includes(section.toLowerCase())
                    ).length;

                    const score = 1 - (missingCount / args.expected.mustIncludeSections.length);
                    return {
                        name: "Section Completeness",
                        score: score,
                        metadata: {
                            missingSections: missingCount,
                            totalRequired: args.expected.mustIncludeSections.length
                        }
                    };
                }
            },

            // Score 2: Keyword Relevance
            {
                name: "Mentions Key Topics",
                scorer: (args: { output: string; expected: any }) => {
                    const output = args.output.toLowerCase();
                    const mentionedCount = args.expected.shouldMentionKeywords.filter(
                        (keyword: string) => output.includes(keyword.toLowerCase())
                    ).length;

                    const score = mentionedCount / args.expected.shouldMentionKeywords.length;
                    return {
                        name: "Keyword Relevance",
                        score: score,
                        metadata: {
                            mentioned: mentionedCount,
                            total: args.expected.shouldMentionKeywords.length,
                            keywords: args.expected.shouldMentionKeywords
                        }
                    };
                }
            },

            // Score 3: Specificity - Has Color Codes
            {
                name: "Provides Color Recommendations",
                scorer: (args: { output: string; expected: any }) => {
                    if (!args.expected.shouldHaveColors) return { name: "Color Codes", score: 1 };

                    const hexCodeRegex = /#[0-9A-Fa-f]{6}/g;
                    const colorCodes = args.output.match(hexCodeRegex);
                    const score = colorCodes && colorCodes.length >= 3 ? 1 : (colorCodes && colorCodes.length > 0 ? 0.5 : 0);

                    return {
                        name: "Color Specificity",
                        score: score,
                        metadata: {
                            hexCodesFound: colorCodes ? colorCodes.length : 0,
                            examples: colorCodes ? colorCodes.slice(0, 3) : []
                        }
                    };
                }
            },

            // Score 4: Typography Recommendations
            {
                name: "Suggests Typography",
                scorer: (args: { output: string; expected: any }) => {
                    if (!args.expected.shouldHaveFonts) return { name: "Typography", score: 1 };

                    const commonFonts = ['inter', 'roboto', 'helvetica', 'arial', 'georgia', 'times', 'playfair', 'lato', 'montserrat', 'open sans', 'poppins', 'raleway'];
                    const output = args.output.toLowerCase();

                    const fontsMentioned = commonFonts.filter(font => output.includes(font));
                    const score = fontsMentioned.length >= 2 ? 1 : (fontsMentioned.length === 1 ? 0.5 : 0);

                    return {
                        name: "Typography Recommendations",
                        score: score,
                        metadata: {
                            fontsFound: fontsMentioned.length,
                            examples: fontsMentioned.slice(0, 3)
                        }
                    };
                }
            },

            // Score 5: Brief Length (Comprehensiveness)
            {
                name: "Sufficient Detail",
                scorer: (args: { output: string; expected: any }) => {
                    const wordCount = args.output.split(/\s+/).length;
                    const minWords = args.expected.minLength;

                    const score = wordCount >= minWords ? 1 : Math.min(wordCount / minWords, 1);

                    return {
                        name: "Comprehensiveness",
                        score: score,
                        metadata: {
                            wordCount: wordCount,
                            minimumRequired: minWords,
                            percentOfTarget: Math.round((wordCount / minWords) * 100)
                        }
                    };
                }
            },

            // Score 6: Format Quality (Markdown Structure)
            {
                name: "Well-Formatted",
                scorer: (args: { output: string }) => {
                    const hasHeaders = (args.output.match(/^#{1,3}\s/gm) || []).length >= 3;
                    const hasBullets = args.output.includes('- ') || args.output.includes('* ');
                    const hasBold = args.output.includes('**');

                    let score = 0;
                    if (hasHeaders) score += 0.4;
                    if (hasBullets) score += 0.3;
                    if (hasBold) score += 0.3;

                    return {
                        name: "Markdown Quality",
                        score: score,
                        metadata: {
                            hasHeaders,
                            hasBullets,
                            hasBold
                        }
                    };
                }
            },

            // Score 7: Actionability (Has Implementation Prompt)
            {
                name: "Includes Implementation Prompt",
                scorer: (args: { output: string }) => {
                    const keywords = ['implement', 'use this prompt', 'copy', 'designer', 'developer', 'chatgpt', 'claude'];
                    const output = args.output.toLowerCase();
                    const hasPromptSection = keywords.some(keyword => output.includes(keyword));

                    return {
                        name: "Actionability",
                        score: hasPromptSection ? 1 : 0,
                        metadata: {
                            hasImplementationGuidance: hasPromptSection
                        }
                    };
                }
            }
        ],

        maxConcurrency: 1, // Run one at a time to avoid rate limits
    }
);
