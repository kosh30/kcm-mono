module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "packages/*/tsconfig.json",
        EXPERIMENTAL_useSourceOfProjectReferenceRedirect: true,
      },
      plugins: ["react", "@typescript-eslint"],
      extends: [
        "airbnb-typescript",
        "airbnb/hooks",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
      ],
      rules: {
        "import/no-extraneous-dependencies": "off",
        "no-new": "off",
        "react/prop-types": "off",
        "react/jsx-props-no-spreading": "off",
        "react/react-in-jsx-scope": "off",
      },
      settings: {
        react: {
          version: "detect",
        },
      },
    },
  ],
};
