import { defineConfig } from "vitest/config";
import vitestMms from "vitest-mms";

export default defineConfig({
  plugins: [vitestMms()],
});
