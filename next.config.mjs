import createMDX from "@next/mdx";

const withMDX = createMDX({});

export default withMDX({
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
});
