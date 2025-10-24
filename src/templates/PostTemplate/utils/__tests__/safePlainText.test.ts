import { safePlainText } from "../safePlainText";
import * as safeParseModule from "../safeParse";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

jest.mock("@contentful/rich-text-plain-text-renderer", () => ({
  documentToPlainTextString: jest.fn(),
}));

describe("safePlainText", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("正しい JSON の rich text を文字列に変換できる", () => {
    const raw =
      '{"content":[{"nodeType":"paragraph","content":[{"value":"本文","nodeType":"text"}]}]}';
    (documentToPlainTextString as jest.Mock).mockReturnValue("本文");

    const result = safePlainText(raw);
    expect(result).toBe("本文");
    expect(documentToPlainTextString).toHaveBeenCalledTimes(1);
  });

  it("空文字や undefined の場合は空文字を返す", () => {
    expect(safePlainText(undefined)).toBe("");
    expect(safePlainText("")).toBe("");
  });

  it("無効な JSON の場合は空文字を返す", () => {
    const raw = '{"content":[{"nodeType":"paragraph",}]}'; // 不正な JSON
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const result = safePlainText(raw);
    expect(result).toBe("");
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to parse Contentful rich text:"),
      expect.any(SyntaxError)
    );

    consoleSpy.mockRestore();
  });

  it("documentToPlainTextString が例外を投げた場合も空文字を返す", () => {
    const raw =
      '{"content":[{"nodeType":"paragraph","content":[{"value":"本文","nodeType":"text"}]}]}';
    (documentToPlainTextString as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid content");
    });

    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});

    const result = safePlainText(raw);
    expect(result).toBe("");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to convert Contentful rich text to plain text:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
