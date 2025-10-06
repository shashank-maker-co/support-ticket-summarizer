/**
 * Test cases for Website Redesign Brief Generator evaluation
 */

export const testCases = [
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
            shouldHaveColors: true,
            shouldHaveFonts: true,
            minLength: 500,
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
            shouldHaveFonts: false,
            minLength: 300,
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
