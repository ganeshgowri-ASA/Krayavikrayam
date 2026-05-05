import { describe, expect, it } from "vitest";
import { extractMentions } from "../src/hooks/use-mentions";
import type { User } from "../src/types";

const users: User[] = [
  { id: "u1", name: "Aanya Sharma", email: "a@x.com" },
  { id: "u2", name: "Rohan Patel", email: "r@x.com" },
  { id: "u3", name: "Mei Lin", email: "m@x.com" },
];

describe("extractMentions", () => {
  it("extracts a single mention", () => {
    expect(extractMentions("Hi @Rohan Patel, please check.", users)).toEqual([
      "u2",
    ]);
  });

  it("extracts multiple mentions", () => {
    const ids = extractMentions(
      "@Aanya Sharma and @Mei Lin can you align?",
      users
    );
    expect(ids.sort()).toEqual(["u1", "u3"]);
  });

  it("ignores partial matches", () => {
    expect(extractMentions("@Rohan", users)).toEqual([]);
  });

  it("returns empty when no @ in body", () => {
    expect(extractMentions("no mentions here", users)).toEqual([]);
  });
});
