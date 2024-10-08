import { defineConfig } from "vitest/config";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [{ "vitest-mms/mongodb/test": [["mmsTest", "test"]] }],
    }),
  ],
  test: {
    globalSetup: ["vitest-mms/globalSetup"],
  },
});
