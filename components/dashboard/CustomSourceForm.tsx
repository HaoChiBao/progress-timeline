"use client";

import { addCustomSource } from "@/lib/timeline/custom-sources-storage";
import { cn } from "@/lib/utils";
import { useState } from "react";

type CustomSourceFormProps = {
  onAdded: () => void;
  onCancel: () => void;
};

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
  "#78716c",
  "#6F7C5D",
];

export function CustomSourceForm({ onAdded, onCancel }: CustomSourceFormProps) {
  const [label, setLabel] = useState("");
  const [character, setCharacter] = useState("★");
  const [color, setColor] = useState("#6F7C5D");
  const [error, setError] = useState<string | null>(null);

  const previewChar = character.trim().slice(0, 2) || "·";

  const handleSubmit = () => {
    const trimmed = label.trim();
    if (!trimmed) {
      setError("label required");
      return;
    }
    addCustomSource({
      label: trimmed,
      character: previewChar,
      color,
    });
    onAdded();
  };

  return (
    <div className="ascii-panel w-full font-mono text-sm" role="form">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-[10px] text-muted-soft">new source</p>
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-soft hover:text-ink"
          aria-label="Cancel"
        >
          [×]
        </button>
      </div>

      <label className="mb-3 block">
        <span className="mb-1 block text-xs text-muted-soft">name</span>
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            setError(null);
          }}
          placeholder="design, slack, jira…"
          className="min-h-9 w-full border border-hairline bg-transparent px-2 py-1 text-ink focus:border-ink focus:outline-none"
          autoFocus
        />
      </label>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-xs text-muted-soft">tile</span>
          <input
            type="text"
            value={character}
            onChange={(e) => setCharacter(e.target.value.slice(0, 2))}
            maxLength={2}
            className="min-h-11 w-full border border-hairline bg-transparent px-2 text-center text-xl font-bold focus:border-ink focus:outline-none"
            style={{ color }}
            aria-label="Tile character"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-muted-soft">colour</span>
          <div className="flex gap-1">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-11 w-11 shrink-0 cursor-pointer border border-hairline bg-transparent"
              aria-label="Pick colour"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="min-h-11 min-w-0 flex-1 border border-hairline bg-transparent px-2 font-mono text-xs text-ink focus:border-ink focus:outline-none"
            />
          </div>
        </label>
      </div>

      <div className="mb-4">
        <span className="mb-2 block text-xs text-muted-soft">presets</span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "h-7 w-7 border border-hairline transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                color === c && "ring-2 ring-ink ring-offset-1"
              )}
              style={{ backgroundColor: c }}
              aria-label={`Colour ${c}`}
            />
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 border-t border-hairline pt-3 text-xs">
        <span className="text-muted-soft">preview</span>
        <span
          className="text-2xl font-bold leading-none"
          style={{ color }}
          aria-hidden
        >
          {previewChar}
        </span>
        <span className="text-muted-text">{label || "…"}</span>
      </div>

      {error && (
        <p className="mb-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="min-h-9 flex-1 border border-hairline px-3 py-2 text-xs text-ink hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          [ add source ]
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="min-h-9 px-3 py-2 text-xs text-muted-soft hover:text-ink"
        >
          esc
        </button>
      </div>
    </div>
  );
}
