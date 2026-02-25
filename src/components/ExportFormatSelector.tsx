"use client";

/**
 * Export format definitions for the clip renderer.
 * Each format defines crop filter, scale, and display label.
 */
export const EXPORT_FORMATS = [
  { id: "9:16",  label: "9:16 Shorts / Reels / TikTok",  icon: "📱", crop: "crop=ih*9/16:ih",  scale: "scale=1080:1920" },
  { id: "16:9",  label: "16:9 YouTube / Landscape",        icon: "🖥️", crop: "crop=iw:iw*9/16", scale: "scale=1920:1080" },
  { id: "1:1",   label: "1:1 Instagram Feed",               icon: "⬛", crop: "crop=ih:ih",       scale: "scale=1080:1080" },
  { id: "4:5",   label: "4:5 Instagram Portrait",           icon: "📷", crop: "crop=ih*4/5:ih",  scale: "scale=1080:1350" },
] as const;

export type ExportFormatId = typeof EXPORT_FORMATS[number]["id"];

interface Props {
  value: ExportFormatId;
  onChange: (id: ExportFormatId) => void;
  disabled?: boolean;
}

export function ExportFormatSelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex gap-2 flex-wrap">
      {EXPORT_FORMATS.map((fmt) => (
        <button
          key={fmt.id}
          type="button"
          disabled={disabled}
          onClick={() => onChange(fmt.id)}
          title={fmt.label}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
            value === fmt.id
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-muted/30 border-border hover:border-primary/50",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
        >
          <span>{fmt.icon}</span>
          <span>{fmt.id}</span>
        </button>
      ))}
    </div>
  );
}
