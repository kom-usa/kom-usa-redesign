import assert from "node:assert/strict";
import test from "node:test";

import { createReviewExcerpt } from "./review-excerpt";

test("keeps short reviews intact and normalizes whitespace", () => {
  assert.equal(createReviewExcerpt("  Great   work and communication.  "), "Great work and communication.");
});

test("shortens long reviews at a word boundary", () => {
  const review = "KOM USA handled a detailed home project with clear communication and careful work from the first conversation through the final walkthrough.";
  const excerpt = createReviewExcerpt(review, 80);

  assert.equal(excerpt, "KOM USA handled a detailed home project with clear communication and careful…");
  assert.ok(excerpt.length <= 81);
});
