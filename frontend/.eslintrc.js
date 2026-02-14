module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ["react-app", "plugin:react/recommended"],
  plugins: ["react"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
