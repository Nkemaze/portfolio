import React from "react";
import { Box, Cpu, Workflow } from "lucide-react";
import { tools } from "../lib/technology.mjs";

export default function TechnologyIcon({ name, size = 30 }) {
  const tool = tools[name];
  if (!tool) return null;
  if (tool.symbol) {
    const Symbol =
      tool.symbol === "ai" ? Cpu : tool.symbol === "ar" ? Box : Workflow;
    return <Symbol size={size} strokeWidth={1.5} aria-hidden="true" />;
  }
  return (
    <span
      className={`technology-mark ${tool.secondIcon ? "technology-mark-pair" : ""}`}
      style={{ width: tool.secondIcon ? size * 1.7 : size, height: size }}
      aria-hidden="true"
    >
      <img src={`/icons/${tool.icon}.svg`} width={size} height={size} alt="" />
      {tool.secondIcon && (
        <img
          src={`/icons/${tool.secondIcon}.svg`}
          width={size}
          height={size}
          alt=""
        />
      )}
    </span>
  );
}
