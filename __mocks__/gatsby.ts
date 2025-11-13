import { createElement } from "react";

export const graphql = jest.fn();
export const StaticQuery = jest.fn();
export const useStaticQuery = jest.fn();

export const Link = jest
  .fn()
  .mockImplementation(
    ({ to, ...rest }: { to: string; [key: string]: unknown }) =>
      createElement("a", { href: to, ...rest })
  );
