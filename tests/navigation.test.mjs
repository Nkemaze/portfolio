import test from "node:test";
import assert from "node:assert/strict";
import { navigation, activeSection } from "../src/lib/navigation.mjs";

test("header follows actual page order without removed sections", () => {
  assert.deepEqual(
    navigation.map(item => item.id),
    ["intro", "project-journal", "about", "stack", "contact"]
  );
});
test("active section tracks the viewport activation line in both directions", () => {
  const sections = [
    { id: "intro", top: -2000 },
    { id: "project-journal", top: -900 },
    { id: "about", top: 350 },
    { id: "stack", top: 1200 },
    { id: "contact", top: 2000 },
  ];
  assert.equal(activeSection(sections, 900, 76), "project-journal");
  sections[2].top = 130;
  assert.equal(activeSection(sections, 900, 76), "about");
  assert.equal(activeSection(sections, 900, 76, true), "contact");
  assert.equal(activeSection([], 900, 76), "intro");
});
