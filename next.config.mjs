import createMDX from "@next/mdx";

const withMDX = createMDX({});

export default withMDX({
  experimental: { globalNotFound: true },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      { source: "/guides/beginner-guide", destination: "/guides/getting-started", permanent: true },
      { source: "/market", destination: "/guides/market", permanent: true },
    ];
  },
});
