import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { technologyGroups, tools } from "../src/lib/technology.mjs";

test("all original tools have icons and detail copy", () => {
  const names = technologyGroups.flatMap(group => group.items);
  assert.equal(names.length, 15);
  assert.equal(new Set(names).size, 15);
  for (const name of names) {
    const tool = tools[name];
    assert.ok(tool && tool.detail && tool.kind && tool.note, name);
    assert.ok(tool.icon || tool.symbol, name);
    for (const icon of [tool.icon, tool.secondIcon].filter(Boolean)) {
      const path = new URL(`../public/icons/${icon}.svg`, import.meta.url);
      assert.ok(existsSync(path), icon);
      assert.match(readFileSync(path, "utf8"), /<svg/);
    }
  }
});
test("technology group names and exact original tool names remain intact", () => {
  assert.deepEqual(
    technologyGroups.map(group => group.title),
    ["Frontend", "Backend", "Mobile & data", "Exploring"]
  );
  assert.deepEqual(technologyGroups[0].items, [
    "React",
    "JavaScript",
    "HTML & CSS",
    "Tailwind CSS",
  ]);
});
