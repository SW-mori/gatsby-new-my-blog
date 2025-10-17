// jest-preprocess.ts
import { createTransformer } from "babel-jest";
import babelConfig from "./babel.config.js"; // ESM で読み込む場合

export default createTransformer(babelConfig);
