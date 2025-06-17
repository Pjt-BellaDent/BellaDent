module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    // max-len 규칙 추가 또는 수정
    "max-len": ["error", { code: 120, ignoreUrls: true }], // 예: 최대 길이를 120자로 늘림
    // 또는 max-len 규칙을 아예 비활성화 (권장하지 않음)
    // "max-len": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
};
