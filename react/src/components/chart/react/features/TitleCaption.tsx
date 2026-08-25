/**
 * <Chart.Title> and <Chart.Caption> — HTML header/footer inside the
 * reserved layout zones (both renderers).
 */
import type { CaptionProps, TitleProps } from "../props";
import { useChart } from "../ChartContext";

export function Title(props: TitleProps) {
  const ctx = useChart();
  const centered = props.centered ?? true;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: centered ? "center" : "flex-start",
        height: "100%",
        gap: 2,
      }}
    >
      {props.title !== undefined && (
        <div
          style={{
            color: ctx.theme.titleText,
            fontSize: 15,
            fontWeight: 600,
            lineHeight: "22px",
            whiteSpace: "nowrap",
          }}
        >
          {props.title}
        </div>
      )}
      {props.subtitle !== undefined && (
        <div
          style={{
            color: ctx.theme.subtitleText,
            fontSize: 12,
            lineHeight: "16px",
            whiteSpace: "nowrap",
          }}
        >
          {props.subtitle}
        </div>
      )}
      {props.children}
    </div>
  );
}

export function Caption(props: CaptionProps) {
  const ctx = useChart();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100%",
        color: ctx.theme.subtleText,
        fontSize: 11,
        lineHeight: "18px",
      }}
    >
      {props.text}
      {props.children}
    </div>
  );
}
