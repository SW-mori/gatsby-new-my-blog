import React from "react";
import { render } from "@testing-library/react";
import { SEO } from "../Seo";

describe("SEOコンポーネント", () => {
  const props = {
    title: "テストタイトル",
    description: "テスト説明",
    image: "https://example.com/image.png",
    pathname: "/test-path",
  };

  it("titleとmetaタグが正しくレンダリングされる", () => {
    const { container } = render(<SEO {...props} />);

    // title
    const title = container.querySelector("title");
    expect(title).not.toBeNull();
    expect(title?.textContent).toBe(props.title);

    // meta[name="description"]
    const metaDescription = container.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    expect(metaDescription).not.toBeNull();
    expect(metaDescription?.content).toBe(props.description);

    // meta[property="og:title"]
    const metaOgTitle = container.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]'
    );
    expect(metaOgTitle).not.toBeNull();
    expect(metaOgTitle?.content).toBe(props.title);

    // meta[property="og:description"]
    const metaOgDescription = container.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]'
    );
    expect(metaOgDescription).not.toBeNull();
    expect(metaOgDescription?.content).toBe(props.description);

    // meta[property="og:image"]
    const metaOgImage = container.querySelector<HTMLMetaElement>(
      'meta[property="og:image"]'
    );
    expect(metaOgImage).not.toBeNull();
    expect(metaOgImage?.content).toBe(props.image);

    // meta[property="og:url"]
    const metaOgUrl = container.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    expect(metaOgUrl).not.toBeNull();
    expect(metaOgUrl?.content).toBe(props.pathname);

    // meta[name="twitter:card"]
    const metaTwitterCard = container.querySelector<HTMLMetaElement>(
      'meta[name="twitter:card"]'
    );
    expect(metaTwitterCard).not.toBeNull();
    expect(metaTwitterCard?.content).toBe("summary_large_image");

    // meta[name="twitter:title"]
    const metaTwitterTitle = container.querySelector<HTMLMetaElement>(
      'meta[name="twitter:title"]'
    );
    expect(metaTwitterTitle).not.toBeNull();
    expect(metaTwitterTitle?.content).toBe(props.title);

    // meta[name="twitter:description"]
    const metaTwitterDescription = container.querySelector<HTMLMetaElement>(
      'meta[name="twitter:description"]'
    );
    expect(metaTwitterDescription).not.toBeNull();
    expect(metaTwitterDescription?.content).toBe(props.description);

    // meta[name="twitter:image"]
    const metaTwitterImage = container.querySelector<HTMLMetaElement>(
      'meta[name="twitter:image"]'
    );
    expect(metaTwitterImage).not.toBeNull();
    expect(metaTwitterImage?.content).toBe(props.image);
  });
});
