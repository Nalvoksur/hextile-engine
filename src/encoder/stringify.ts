import { ColorMap } from "./types"; 
import { compressIndices } from "./compress"; 

export function stringify(map: ColorMap): string {
  const lines: string[] = [];

  const sortedEntries = Array.from(map.entries()).sort(
    (a: [string, number[]], b: [string, number[]]) => b[1].length - a[1].length
  );

  for (const [color, indices] of sortedEntries) {
    lines.push(`${color}:${compressIndices(indices)}`);
  }

  return lines.join("\n");
}