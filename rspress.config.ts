import * as path from "path";
import { defineConfig } from "rspress/config";

import baseConfig from "./config/baseConfig";
import themeConfig from "./config/themeConfig";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  ...baseConfig,
  themeConfig,
});
