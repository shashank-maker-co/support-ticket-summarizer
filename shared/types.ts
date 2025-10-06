/**
 * Shared TypeScript types for the Website Redesign Brief Generator
 */

export interface RedesignBriefInput {
    websiteUrl: string;
    businessDescription: string;
    mainGoal: string;
    targetAudience: string;
    notWorking: string[];
    isWorking: string[];
    desiredFeeling: string;
    visualStyle: string;
    currentPlatform: string;
    inspirationSites: string;
}

export interface RedesignBriefOutput {
    success: boolean;
    brief?: string;
    error?: string;
}
