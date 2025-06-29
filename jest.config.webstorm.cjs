/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.js$": ["babel-jest", {
      presets: [
        ["@babel/preset-env",
          {
            modules: "commonjs",
            targets: { node: "current" }
          }
        ]
      ]
    }]
  },

  // Принудительные настройки для WebStorm
  globals: {
    'ts-jest': {
      useESM: false
    }
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  moduleFileExtensions: ["js", "mjs", "cjs", "jsx", "ts", "tsx", "json", "node"],

  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/*.(test|spec).[jt]s?(x)"
  ],

  // Дополнительные настройки для стабильной работы в WebStorm
  testTimeout: 10000,
  verbose: true,


  // Настройки для работы с модулями
  transformIgnorePatterns: [
    "node_modules/(?!(.*\\.mjs$))"
  ],
  // Дополнительные настройки для стабильности
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"]
  }
};

module.exports = config;
