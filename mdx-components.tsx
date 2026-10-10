import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithRef } from "react";

type MdxLinkProps = ComponentPropsWithRef<"a">;

function MdxLink({ href, ...props }: MdxLinkProps) {
  if (
    typeof href === "string" &&
    (href.startsWith("/") || href.startsWith("#"))
  ) {
    return <Link href={href} {...props} />;
  }

  return <a href={href} {...props} />;
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: MdxLink,
    ...components,
  };
}
