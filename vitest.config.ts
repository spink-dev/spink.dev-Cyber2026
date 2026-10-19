/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// getViteConfig loads the Astro config (aliases, astro:env, integrations) into Vitest.
export default getViteConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'src/**/*.test.ts'],
    environment: 'node',
    passWithNoTests: true,
  },
});
