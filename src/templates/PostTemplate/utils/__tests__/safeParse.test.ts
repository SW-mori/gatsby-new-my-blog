import { safeParse } from "../safeParse";

describe("safeParse", () => {
  it("JSON 文字列を正しくパースできる", () => {
    const raw = '{"foo": "bar", "num": 42}';
    const result = safeParse(raw);
    expect(result).toEqual({ foo: "bar", num: 42 });
  });

  it("空文字や undefined の場合は null を返す", () => {
    expect(safeParse(undefined)).toBeNull();
    expect(safeParse("")).toBeNull();
  });

  it("無効な JSON の場合は null を返す", () => {
    const raw = '{"foo": "bar", }';
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const result = safeParse(raw);
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Failed to parse Contentful rich text:"),
      expect.any(SyntaxError)
    );
    consoleSpy.mockRestore();
  });
});
