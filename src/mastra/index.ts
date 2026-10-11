import { Mastra } from '@mastra/core';
import { verdantAgent, groundTraceAgent } from './agents/sanctuaryAgent';

export const mastra = new Mastra({
  agents: {
    verdantAgent,
    groundTraceAgent,
  },
});

export { verdantAgent, groundTraceAgent };
