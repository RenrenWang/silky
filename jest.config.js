module.exports = {
    testEnvironment: "jsdom",
    collectCoverage: true,
    collectCoverageFrom: [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/index.tsx", // 忽略入口文件
      "!src/**/*.d.ts", // 忽略类型定义
    ],
    coverageReporters: ["text", "lcov"],
  };
  