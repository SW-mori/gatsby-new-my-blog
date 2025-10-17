import { createTransformer } from "babel-jest";

const babelOptions = {
  presets: ["babel-preset-gatsby"],
};

export default createTransformer(babelOptions);
