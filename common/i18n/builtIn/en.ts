// The reference kit catalog (spec §4.3).
//
// Values are the components' current hardcoded literals VERBATIM (inventory
// refined during Phase 2, 2026-08-29): no-provider rendering is therefore
// byte-identical to before i18n. Apostrophes are ICU-escaped (\') because
// catalog values are ICU message sources.
//
// Source components (React, unless noted):
//   accordion  Accordion.tsx            (title defaults "Loading"/"No items")
//   combobox   Combobox.tsx             (emptyMessage, trailingIconLabel)
//   datepicker DatePicker/ + Calendar   (Today, Clear, aria labels, "Date")
//   help       HelpButton.tsx/.vue      ("Help" fallbacks, Show/Close help)
//   inforow    InfoRow.tsx              (aria-label "Loading")
//   inlinepanel InlinePanel.tsx/.vue    (cancelLabel, aria "Close")
//   modal      Modal.tsx/.vue           (cancelLabel, aria "Close dialog")
//   notificationmodal NotificationModal (actionLabel "Close")
//   pill       Pill.tsx/.vue            (removeLabel "Remove")
//   progressspinner ProgressSpinner     (aria-label "Loading")
//   pagedpanel PagedPanel.tsx/.vue      (emptyMessage "No data available.")
//   searchbar  SearchBar.tsx/.vue       (aria "Clear search")
//   sidemenu   SideMenu.tsx/.vue        (placeholder, aria, Collapse, tooltips)
//   sidepanel  SidePanel.tsx/.vue       (Close, aria, Resize panel)
//   smartgrid  SmartGridItemPalette.tsx (search placeholder/aria, Add items)
//   spinner    Spinner/StatusSpinner    (sr-only "Loading")
//   table      Table.tsx (React only)   (emptyState "No data to display")
//   toast      Toast/ToastMessageCard   (aria "Close notification")
//   variablepicker VariablePicker.tsx   (placeholder, srLabel, empty text)
//
// Icon names ("Close", "Search" used as icon="…") are NOT catalog entries.
import type { MessageCatalog } from "../types";

export const EN_KIT_CATALOG: MessageCatalog = {
  kit: {
    accordion: {
      loadingTitle: "Loading",
      noItemsTitle: "No items",
    },
    combobox: {
      emptyMessage: "No matching options. Keep typing to use what you entered.",
      clear: "Clear",
      showOptions: "Show options",
      loading: "Loading…",
    },
    datepicker: {
      today: "Today",
      clear: "Clear",
      chooseMonth: "Choose month",
      chooseYear: "Choose year",
      panelAriaLabel: "Choose a date",
      panelAriaLabelRange: "Choose a date range",
      chooseMonthNow: "Choose month, now {month} {year}",
      chooseYearNow: "Choose year, now {year}",
      accessibleNameFallback: "Date",
    },
    help: {
      show: "Show help",
      close: "Close help",
      panelTitle: "Help",
    },
    inforow: {
      loading: "Loading",
    },
    inlinepanel: {
      cancel: "Cancel",
      close: "Close",
      confirm: "Confirm",
      delete: "Delete",
      confirmValueLabel: "name",
      typeValuePrefix: "Type the",
      typeValueSuffix: "to confirm:",
    },
    modal: {
      cancel: "Cancel",
      closeAria: "Close dialog",
      confirm: "Confirm",
      delete: "Delete",
      apply: "Apply",
      confirmValueLabel: "name",
      typeValuePrefix: "Type the",
      typeValueSuffix: "to confirm:",
    },
    notificationmodal: {
      action: "Close",
    },
    pagedpanel: {
      empty: "No data available.",
    },
    pill: {
      remove: "Remove",
    },
    progressspinner: {
      loading: "Loading",
    },
    searchbar: {
      clearAria: "Clear search",
      placeholder: "Search...",
    },
    sidemenu: {
      openSidebar: "Open sidebar",
      searchPlaceholder: "Search menu",
      searchAria: "Search menu items",
      closeAria: "Close menu",
      collapse: "Collapse",
      expandSidebar: "Expand sidebar",
      collapseSidebar: "Collapse sidebar",
      verbCollapse: "Collapse",
      verbExpand: "Expand",
      toggleSubmenu: "{verb} {label} submenu",
    },
    sidepanel: {
      closeAria: "Close panel",
      resize: "Resize panel",
    },
    smartgrid: {
      searchAria: "Search items",
      searchPlaceholder: "Search items",
      addItems: "Add items",
      close: "Close",
      closeAria: "Close the item palette",
    },
    spinner: {
      loading: "Loading",
    },
    table: {
      empty: "No data to display",
    },
    toast: {
      closeAria: "Close notification",
    },
    variablepicker: {
      title: "Insert variable",
      noMatches: "Nothing matches “{term}”.",
      noGroupVariables: "No {label} variables.",
      searchPlaceholder: "Search variables...",
      noVariables: "No variables available.",
      close: "Close",
    },
  },
};
