/**
 * Cloudflare Worker - Website Redesign Brief Generator
 *
 * This worker acts as a secure proxy between your frontend and Anthropic API.
 * It takes user answers to 10 questions and generates a comprehensive redesign brief.
 *
 * Deploy to: Cloudflare Workers (Free tier: 100k requests/day)
 */

import { buildRedesignPrompt } from '../shared/prompt-builder.js';

export default {
  async fetch(request, env) {
    // Enable CORS for your GitHub Pages site
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // Change to your GitHub Pages URL in production
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      // Parse the incoming request
      const body = await request.json();
      const {
        websiteUrl,
        businessDescription,
        mainGoal,
        targetAudience,
        notWorking,
        isWorking,
        desiredFeeling,
        visualStyle,
        currentPlatform,
        inspirationSites
      } = body;

      // Validate required fields
      if (!businessDescription || !mainGoal) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Missing required fields: businessDescription, mainGoal'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      // Build the comprehensive prompt for Claude using shared logic
      const prompt = buildRedesignPrompt({
        websiteUrl,
        businessDescription,
        mainGoal,
        targetAudience,
        notWorking,
        isWorking,
        desiredFeeling,
        visualStyle,
        currentPlatform,
        inspirationSites
      });

      // Call Anthropic API
      const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY, // API key stored as Cloudflare secret
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Fast and cheap for quick generation
          max_tokens: 2000, // Enough for a comprehensive brief
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!anthropicResponse.ok) {
        const errorText = await anthropicResponse.text();
        console.error('Anthropic API error:', errorText);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to process ticket with AI'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      const anthropicData = await anthropicResponse.json();
      const textContent = anthropicData.content.find(block => block.type === 'text');
      const brief = textContent ? textContent.text.trim() : '';

      // Return the markdown brief
      return new Response(
        JSON.stringify({
          success: true,
          brief: brief, // Markdown-formatted comprehensive redesign brief
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal server error'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
  },
};
