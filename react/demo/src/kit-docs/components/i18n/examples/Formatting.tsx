import React from "react";
import { useI18n } from "@cjlapao/ui-kit";

/**
 * Formatting — Intl.NumberFormat / Intl.DateTimeFormat under the hood,
 * bound to the active locale (the same binding the kit components use for
 * their date panels).
 */
export const Formatting: React.FC = () => {
  const i18n = useI18n();
  const price = 1234.56;
  const date = new Date(2026, 7, 29, 15, 30);
  const rows: Array<[string, string]> = [
    ["i18n.formatNumber(1234.56)", i18n.formatNumber(price)],
    [
      "i18n.formatNumber(1234567, { notation: \"compact\" })",
      i18n.formatNumber(1234567, { notation: "compact" }),
    ],
    [
      'i18n.formatNumber(0.87, { style: "percent" })',
      i18n.formatNumber(0.87, { style: "percent" }),
    ],
    [
      "i18n.formatDate(date)",
      i18n.formatDate(date),
    ],
    [
      'i18n.formatDate(date, { weekday: "long", day: "numeric", month: "long" })',
      i18n.formatDate(date, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    ],
  ];
  return (
    <table className="w-full text-left text-sm">
      <tbody>
        {rows.map(([call, out]) => (
          <tr
            key={call}
            className="border-b border-neutral-100 last:border-b-0 dark:border-neutral-800"
          >
            <td className="py-2 pr-4 font-mono text-xs text-neutral-500 dark:text-neutral-400">
              {call}
            </td>
            <td className="py-2 font-medium">{out}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Formatting;
