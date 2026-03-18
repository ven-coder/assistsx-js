/**
 * tsup 构建配置
 * - ESM/CJS: 供 npm 和打包工具使用
 * - IIFE: 供 HTML 中通过 script 标签直接引用
 */
module.exports = [
  // 主库构建 (ESM + CJS) - 保持与原有 tsc 输出兼容
  {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    outDir: "dist",
    outExtension({ format }) {
      return {
        js: format === "cjs" ? ".cjs" : ".js",
      };
    },
  },
  // 浏览器 IIFE 构建 - 供 HTML script 标签直接引用
  {
    entry: ["src/index.ts"],
    format: ["iife"],
    dts: false,
    splitting: false,
    sourcemap: true,
    minify: true,
    globalName: "AssistsXJS",
    outDir: "dist",
    outExtension: () => ({ js: ".global.js" }),
    platform: "browser",
  },
];
