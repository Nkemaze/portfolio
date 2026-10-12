import test from "node:test";
import assert from "node:assert/strict";
import {
  bookState,
  pageScrollTarget,
  scrollProgress,
} from "../src/lib/bookProgress.mjs";

test("book covers every project from cover to final chapter", () => {
  assert.equal(bookState(0, 5).from, 0);
  assert.equal(bookState(1, 5).from, 5);
  for (let page = 0; page <= 5; page++) {
    assert.equal(bookState(page / 5, 5).active, page);
    assert.equal(bookState(page / 5, 5).turn, 0);
  }
});
test("continuous scroll scrubs the double sided page", () => {
  const state = bookState(0.5, 5);
  assert.equal(state.from, 2);
  assert.equal(state.to, 3);
  assert.equal(state.turn, 0.5);
});
test("scroll clamps before and after the embedded section", () => {
  assert.equal(scrollProgress(1000, 4000, 900, 76), 0);
  assert.equal(scrollProgress(-8000, 4000, 900, 76), 1);
  assert.equal(bookState(-1, 5).active, 0);
  assert.equal(bookState(2, 5).active, 5);
});
test("button targets and scroll progress agree at each chapter", () => {
  for (let page = 0; page <= 5; page++) {
    const y = pageScrollTarget(2000, 4200, 900, 76, page, 5);
    const progress = scrollProgress(2000 - y, 4200, 900, 76);
    assert.ok(Math.abs(progress - page / 5) < 0.0001);
  }
});
