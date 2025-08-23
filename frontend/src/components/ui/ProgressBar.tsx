import React from "react";

type Size = "sm" | "md" | "lg";
type Tone = "primary" | "success" | "warning" | "danger" | "neutral";

export interface ProgressBarProps {
    value: number;           // current value
    max?: number;             // default 100
    showLabel?: boolean;      // show % text inside bar
    size?: Size;              // visual size
    tone?: Tone;              // color tone
    striped?: boolean;        // diagonal stripes
    animated?: boolean;       // animate stripes
    ariaLabel?: string;       // a11y label
    className?: string;       // extra className
    style?: React.CSSProperties;
}

export default function ProgressBar({
    value,
    max = 100,
    showLabel = false,
    size = "md",
    tone = "primary",
    striped = false,
    animated = false,
    ariaLabel = "Progress",
    className,
    style,
}: ProgressBarProps) {
    const safeMax = Math.max(max, 1);
    const pct = Math.max(0, Math.min(100, (value / safeMax) * 100));

    const classes = [
        "progress",
        `progress--${size}`,
        `progress--${tone}`,
        striped && "progress--striped",
        animated && "progress--animated",
        className, // optional extra from props
    ]
        .filter(Boolean) // remove false/null/undefined
        .join(" ");

    return (
        <div
            className={classes}
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuemin={0}
            aria-valuemax={safeMax}
            aria-valuenow={Math.round((pct * safeMax) / 100)}
            style={{ ...style, ["--progress-value" as any]: `${pct}%` }}
        >
            <div className="progress__bar">
                {showLabel && (
                    <span className="progress__label">{Math.round(pct)}%</span>
                )}
            </div>
        </div>
    );
}
