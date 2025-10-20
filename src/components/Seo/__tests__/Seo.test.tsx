import React from "react";
import { render } from "@testing-library/react";
import { Helmet } from "react-helmet";
import { SEO } from "../Seo";
import { useStaticQuery, graphql } from "gatsby";

jest.mock("gatsby", () => {
  const actualGatsby = jest.requireActual("gatsby");
  return {
    ...actualGatsby,
    graphql: jest.fn(),
    useStaticQuery: jest.fn(),
  };
});

describe("SEOコンポーネント", () => {
  const props = {
    title: "テストタイトル",
    description: "テスト説明",
    image: "/test-image.png",
    pathname: "/test-path",
    lang: "ja",
    alternateLangs: [
      { hreflang: "ja", href: "/ja/test-path" },
      { hreflang: "en", href: "/en/test-path" },
    ],
  };

  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockReturnValue({
      site: {
        siteMetadata: {
          title: "デフォルトタイトル",
          description: "デフォルト説明",
          siteUrl: "https://example.com",
        },
      },
    });
  });

  it("title, meta, og, twitter, link, scriptタグが正しくレンダリングされる", () => {
    render(<SEO {...props} />);
    const helmet = Helmet.peek();

    expect(helmet.title).toBe(props.title);

    const metaDescription = helmet.metaTags.find(
      (m: any) => m.name === "description"
    );
    expect(metaDescription?.content).toBe(props.description);

    expect(
      helmet.metaTags.find((m: any) => m.property === "og:title")?.content
    ).toBe(props.title);
    expect(
      helmet.metaTags.find((m: any) => m.property === "og:description")?.content
    ).toBe(props.description);
    expect(
      helmet.metaTags.find((m: any) => m.property === "og:image")?.content
    ).toBe(`https://example.com${props.image}`);
    expect(
      helmet.metaTags.find((m: any) => m.property === "og:url")?.content
    ).toBe(`https://example.com${props.pathname}`);

    expect(
      helmet.metaTags.find((m: any) => m.name === "twitter:card")?.content
    ).toBe("summary_large_image");
    expect(
      helmet.metaTags.find((m: any) => m.name === "twitter:title")?.content
    ).toBe(props.title);
    expect(
      helmet.metaTags.find((m: any) => m.name === "twitter:description")
        ?.content
    ).toBe(props.description);
    expect(
      helmet.metaTags.find((m: any) => m.name === "twitter:image")?.content
    ).toBe(`https://example.com${props.image}`);

    const scriptTag = helmet.scriptTags.find(
      (s: any) => s.type === "application/ld+json"
    );
    expect(scriptTag).toBeDefined();
    const json = scriptTag ? JSON.parse(scriptTag.innerHTML) : null;
    expect(json).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: props.title,
      description: props.description,
      image: `https://example.com${props.image}`,
      url: `https://example.com${props.pathname}`,
    });
  });
});
