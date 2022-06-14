import React from "react";
//Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import { CodeSandBox } from "@site/src/components/CodeSandBox";
import CustomSwiper from "../components/CustomSwiper";
import { Aside } from "../components/Aside";

export default {
  //re-use the default mapping
  ...MDXComponents,
  codesandbox: CodeSandBox,
  swiper: CustomSwiper,
  aside: Aside,
};
