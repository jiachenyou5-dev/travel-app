import { defineConfig } from "@playwright/test";

const databaseUrl = "file:./travel-e2e.db";
export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "*.spec.ts",
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: { baseURL: "http://localhost:3016", channel: "chrome", headless: true, viewport: { width: 1365, height: 900 } },
  webServer: {
    command: "npm run db:migrate && npx tsx tests/e2e/seed.ts && npm run dev -- --port 3016",
    url: "http://localhost:3016",
    reuseExistingServer: false,
    timeout: 120000,
    env: { DATABASE_URL: databaseUrl, AUTH_SECRET: "isolated-e2e-secret-not-for-production", AUTH_TRUST_HOST: "true", NEXTAUTH_URL: "http://localhost:3016", AMAP_API_KEY: "", NEXT_PUBLIC_AMAP_JS_KEY: "", FLYAI_API_KEY: "" },
  },
});
