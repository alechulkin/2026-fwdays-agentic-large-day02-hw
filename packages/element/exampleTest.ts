import React from "react"; // ❌ React import not allowed in domain logic

export const elementState = {}; // ❌ no explicit type

export function updateElementState(key, value) {
  // ❌ missing explicit types
  elementState[key] = value; // ❌ direct mutation, mutable state
  return elementState;
}

export default function ElementComponent() {
  // ❌ default export + UI code (.ts cannot parse JSX; DOM via createElement)
  return React.createElement("div", null, "Element UI"); // ❌ DOM / React UI
}
