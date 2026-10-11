import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const sensoryMissionInputSchema = z.object({
  sanctuaryName: z.string().describe('Name of the discovered micro-sanctuary'),
  category: z.string().describe('Category (e.g., pocket_park, quiet_bench, botanical_corner, urban_grove)'),
  sensoryFeatures: z.array(z.string()).describe('Sensory elements present at the location (e.g., moss, running water, shade)'),
  mood: z.string().describe('Current user mental state (e.g., screen fatigue, high stress, need sunlight)'),
  availableMins: z.number().default(20).describe('Total time window user has available'),
});

export const generateSensoryMissionTool = createTool({
  id: 'generateSensoryMissionTool',
  description:
    'Generates a restorative, screen-free sensory mindfulness mission tailored to the recommended micro-sanctuary and user stress level.',
  inputSchema: sensoryMissionInputSchema,
  execute: async (input: any) => {
    const sanctuaryName = input?.sanctuaryName ?? input?.context?.sanctuaryName ?? 'Micro-Sanctuary';
    const category = input?.category ?? input?.context?.category ?? 'pocket_park';
    const sensoryFeatures = input?.sensoryFeatures ?? input?.context?.sensoryFeatures ?? ['greenery', 'fresh air'];
    const mood = input?.mood ?? input?.context?.mood ?? 'screen fatigue';
    const availableMins = input?.availableMins ?? input?.context?.availableMins ?? 20;

    // Craft rich grounded instructions based on location features
    const primaryFeature = sensoryFeatures[0] || 'natural greenery';
    const secondaryFeature = sensoryFeatures[1] || 'gentle breeze';

    let focusPrompt = '';
    let sensoryAction = '';

    if (mood.toLowerCase().includes('sun') || mood.toLowerCase().includes('light')) {
      focusPrompt = `Tilt your chin upward toward the open sky and feel the direct warmth on your eyelids for 90 slow breaths.`;
      sensoryAction = `Locate the brightest open surface or wooden bench. Notice the contrast of sunlit skin against the ambient cool air.`;
    } else if (mood.toLowerCase().includes('stress') || mood.toLowerCase().includes('fatigue')) {
      focusPrompt = `Sit completely still under the ${primaryFeature}. Close your eyes and listen until you can isolate three distinct non-mechanical sounds.`;
      sensoryAction = `Rest your hands palm-down on the nearest stone, bark, or wooden seat. Ground yourself in the coolness of the surface.`;
    } else {
      focusPrompt = `Slow your walking pace to half your usual stride as you enter. Count 20 paces while observing only the movement of leaves in the canopy.`;
      sensoryAction = `Breathe in deeply through your nose twice, identifying the scent of ${primaryFeature} or fresh earth.`;
    }

    const mission = {
      title: `The ${primaryFeature.replace(/\b\w/g, (c: string) => c.toUpperCase())} Grounding Protocol`,
      location: sanctuaryName,
      targetDurationMins: availableMins,
      instructions: [
        `Walk unhurriedly to ${sanctuaryName} without looking at navigation maps unless strictly necessary.`,
        focusPrompt,
        sensoryAction,
        `Observe the ${secondaryFeature} without taking your phone out to photograph it. Let the image imprint in your memory instead.`,
      ],
      lockoutMessage: `Put your phone into your pocket or backpack now. Look up at the canopy. Step outside.`,
    };

    return mission;
  },
});
