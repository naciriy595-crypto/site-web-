const COLOR_HEX: Record<string, string> = {
  onyx: "#16161a",
  crimson: "#8c1c2b",
  scarlet: "#b91c1c",
  teal: "#0f766e",
  graphite: "#4b4b52",
  "noir gold": "#1a1a1a",
  black: "#161616",
  white: "#f5f5f5",
  silver: "#c7c9cc",
  gold: "#b8934a",
  gunmetal: "#3a3d42",
};

export function colorHex(name: string): string {
  return COLOR_HEX[name.trim().toLowerCase()] ?? "#8a8a8f";
}
