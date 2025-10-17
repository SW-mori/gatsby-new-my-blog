import type { Config } from "jest";

const config: Config = {
  transform: {
    "^.+\\.[jt]sx?$": "<rootDir>/jest-preprocess.ts",
  },
  moduleNameMapper: {
    ".+\\.(css|sass|scss|less)$": "identity-obj-proxy",
    ".+\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/file-mock.ts",
  },
  testPathIgnorePatterns: ["node_modules", ".cache", "public"],
  transformIgnorePatterns: ["node_modules/(?!(gatsby)/)"],
  globals: { __PATH_PREFIX__: `` },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: [
    "<rootDir>/src/__tests__/**/*.{ts,tsx,js,jsx}",
    "<rootDir>/src/**/*.{spec,test}.{ts,tsx,js,jsx}",
  ],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};

export default config;
