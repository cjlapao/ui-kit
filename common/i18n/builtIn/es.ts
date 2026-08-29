// Curated initial Spanish kit catalog (spec §4.3 / §15: initial translations,
// author-written, overridable per key).
import type { MessageCatalog } from "../types";

export const ES_KIT_CATALOG: MessageCatalog = {
  kit: {
    accordion: {
      loadingTitle: "Cargando",
      noItemsTitle: "Sin elementos",
    },
    combobox: {
      emptyMessage:
        "No hay opciones coincidentes. Sigue escribiendo para usar lo que ingresaste.",
      clear: "Borrar",
      showOptions: "Mostrar opciones",
    },
    datepicker: {
      today: "Hoy",
      clear: "Borrar",
      chooseMonth: "Elegir mes",
      chooseYear: "Elegir año",
      panelAriaLabel: "Elegir una fecha",
      panelAriaLabelRange: "Elegir un rango de fechas",
      accessibleNameFallback: "Fecha",
    },
    help: {
      show: "Mostrar ayuda",
      close: "Cerrar ayuda",
      panelTitle: "Ayuda",
    },
    inforow: {
      loading: "Cargando",
    },
    inlinepanel: {
      cancel: "Cancelar",
      close: "Cerrar",
    },
    modal: {
      cancel: "Cancelar",
      closeAria: "Cerrar diálogo",
    },
    notificationmodal: {
      action: "Cerrar",
    },
    pagedpanel: {
      empty: "No hay datos disponibles.",
    },
    pill: {
      remove: "Quitar",
    },
    progressspinner: {
      loading: "Cargando",
    },
    searchbar: {
      clearAria: "Borrar búsqueda",
    },
    sidemenu: {
      openSidebar: "Abrir barra lateral",
      searchPlaceholder: "Buscar",
      searchAria: "Buscar elementos del menú",
      closeAria: "Cerrar menú",
      collapse: "Contraer",
      expandSidebar: "Expandir barra lateral",
      collapseSidebar: "Contraer barra lateral",
      verbCollapse: "Contraer",
      verbExpand: "Expandir",
      toggleSubmenu: "{verb} el submenú {label}",
    },
    sidepanel: {
      close: "Cerrar",
      closeAria: "Cerrar panel",
      resize: "Redimensionar panel",
    },
    smartgrid: {
      searchAria: "Buscar elementos",
      searchPlaceholder: "Buscar elementos",
      addItems: "Agregar elementos",
      close: "Cerrar",
    },
    spinner: {
      loading: "Cargando",
    },
    table: {
      empty: "No hay datos para mostrar",
    },
    toast: {
      closeAria: "Cerrar notificación",
    },
    variablepicker: {
      searchPlaceholder: "Buscar variables...",
      noVariables: "No hay variables disponibles.",
      close: "Cerrar",
    },
  },
};
