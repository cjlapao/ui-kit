// Curated initial German kit catalog (spec §4.3 / §15: initial translations,
// author-written, overridable per key).
import type { MessageCatalog } from "../types";

export const DE_KIT_CATALOG: MessageCatalog = {
  kit: {
    accordion: {
      loadingTitle: "Wird geladen",
      noItemsTitle: "Keine Einträge",
    },
    combobox: {
      emptyMessage:
        "Keine passenden Optionen. Weiter tippen, um den eingegebenen Wert zu verwenden.",
      clear: "Löschen",
      showOptions: "Optionen anzeigen",
    },
    datepicker: {
      today: "Heute",
      clear: "Löschen",
      chooseMonth: "Monat auswählen",
      chooseYear: "Jahr auswählen",
      panelAriaLabel: "Datum auswählen",
      panelAriaLabelRange: "Datumsbereich auswählen",
      accessibleNameFallback: "Datum",
    },
    help: {
      show: "Hilfe anzeigen",
      close: "Hilfe schließen",
      panelTitle: "Hilfe",
    },
    inforow: {
      loading: "Wird geladen",
    },
    inlinepanel: {
      cancel: "Abbrechen",
      close: "Schließen",
    },
    modal: {
      cancel: "Abbrechen",
      closeAria: "Dialog schließen",
    },
    notificationmodal: {
      action: "Schließen",
    },
    pagedpanel: {
      empty: "Keine Daten verfügbar.",
    },
    pill: {
      remove: "Entfernen",
    },
    progressspinner: {
      loading: "Wird geladen",
    },
    searchbar: {
      clearAria: "Suche löschen",
    },
    sidemenu: {
      openSidebar: "Seitenleiste öffnen",
      searchPlaceholder: "Suchen",
      searchAria: "Menüelemente durchsuchen",
      closeAria: "Menü schließen",
      collapse: "Einklappen",
      expandSidebar: "Seitenleiste ausklappen",
      collapseSidebar: "Seitenleiste einklappen",
      verbCollapse: "Einklappen",
      verbExpand: "Auskklappen",
      toggleSubmenu: "{verb} Untermenü {label}",
    },
    sidepanel: {
      close: "Schließen",
      closeAria: "Panel schließen",
      resize: "Panelgröße ändern",
    },
    smartgrid: {
      searchAria: "Elemente durchsuchen",
      searchPlaceholder: "Elemente durchsuchen",
      addItems: "Elemente hinzufügen",
      close: "Schließen",
    },
    spinner: {
      loading: "Wird geladen",
    },
    table: {
      empty: "Keine Daten anzuzeigen",
    },
    toast: {
      closeAria: "Benachrichtigung schließen",
    },
    variablepicker: {
      searchPlaceholder: "Variablen durchsuchen...",
      noVariables: "Keine Variablen verfügbar.",
      close: "Schließen",
    },
  },
};
