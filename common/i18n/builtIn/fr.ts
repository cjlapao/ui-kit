// Curated initial French kit catalog (spec §4.3 / §15: initial translations,
// author-written, overridable per key). Apostrophes are ICU-escaped (\' —
// catalog values are ICU message sources).
import type { MessageCatalog } from "../types";

export const FR_KIT_CATALOG: MessageCatalog = {
  kit: {
    accordion: {
      loadingTitle: "Chargement",
      noItemsTitle: "Aucun élément",
    },
    combobox: {
      emptyMessage:
        "Aucune option correspondante. Continuez à saisir pour utiliser ce que vous avez saisi.",
      clear: "Effacer",
      showOptions: "Afficher les options",
    },
    datepicker: {
      today: "Aujourd\\'hui",
      clear: "Effacer",
      chooseMonth: "Choisir le mois",
      chooseYear: "Choisir l\\'année",
      panelAriaLabel: "Choisir une date",
      panelAriaLabelRange: "Choisir une plage de dates",
      accessibleNameFallback: "Date",
    },
    help: {
      show: "Afficher l\\'aide",
      close: "Fermer l\\'aide",
      panelTitle: "Aide",
    },
    inforow: {
      loading: "Chargement",
    },
    inlinepanel: {
      cancel: "Annuler",
      close: "Fermer",
    },
    modal: {
      cancel: "Annuler",
      closeAria: "Fermer la fenêtre de dialogue",
    },
    notificationmodal: {
      action: "Fermer",
    },
    pagedpanel: {
      empty: "Aucune donnée disponible.",
    },
    pill: {
      remove: "Supprimer",
    },
    progressspinner: {
      loading: "Chargement",
    },
    searchbar: {
      clearAria: "Effacer la recherche",
    },
    sidemenu: {
      openSidebar: "Ouvrir la barre latérale",
      searchPlaceholder: "Rechercher",
      searchAria: "Rechercher dans le menu",
      closeAria: "Fermer le menu",
      collapse: "Réduire",
      expandSidebar: "Déployer la barre latérale",
      collapseSidebar: "Réduire la barre latérale",
      verbCollapse: "Réduire",
      verbExpand: "Déployer",
      toggleSubmenu: "{verb} le sous-menu {label}",
    },
    sidepanel: {
      close: "Fermer",
      closeAria: "Fermer le panneau",
      resize: "Redimensionner le panneau",
    },
    smartgrid: {
      searchAria: "Rechercher des éléments",
      searchPlaceholder: "Rechercher des éléments",
      addItems: "Ajouter des éléments",
      close: "Fermer",
    },
    spinner: {
      loading: "Chargement",
    },
    table: {
      empty: "Aucune donnée à afficher",
    },
    toast: {
      closeAria: "Fermer la notification",
    },
    variablepicker: {
      searchPlaceholder: "Rechercher des variables...",
      noVariables: "Aucune variable disponible.",
      close: "Fermer",
    },
  },
};
