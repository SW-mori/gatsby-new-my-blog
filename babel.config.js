// babel.config.js
export default {
  presets: [
    "babel-preset-gatsby",
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
