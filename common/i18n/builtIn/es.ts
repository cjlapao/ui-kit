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
      loading: "Cargando…",
    },
    datepicker: {
      today: "Hoy",
      clear: "Borrar",
      chooseMonth: "Elegir mes",
      chooseYear: "Elegir año",
      panelAriaLabel: "Elegir una fecha",
      panelAriaLabelRange: "Elegir un rango de fechas",
      chooseMonthNow: "Elegir mes, ahora {month} {year}",
      chooseYearNow: "Elegir a\u00f1o, ahora {year}",
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
      confirm: "Confirmar",
      delete: "Eliminar",
      confirmValueLabel: "nombre",
      typeValuePrefix: "Escribe el",
      typeValueSuffix: "para confirmar:",
      back: "Volver",
    },
    modal: {
      cancel: "Cancelar",
      closeAria: "Cerrar diálogo",
      confirm: "Confirmar",
      delete: "Eliminar",
      apply: "Aplicar",
      confirmValueLabel: "nombre",
      typeValuePrefix: "Escribe el",
      typeValueSuffix: "para confirmar:",
      back: "Volver",
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
      placeholder: "Buscar...",
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
      closeAria: "Cerrar panel",
      resize: "Redimensionar panel",
    },
    smartgrid: {
      searchAria: "Buscar elementos",
      searchPlaceholder: "Buscar elementos",
      addItems: "Agregar elementos",
      close: "Cerrar",
      closeAria: "Cerrar la paleta de elementos",
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
      title: "Insertar variable",
      noMatches: "Nada coincide con “{term}”.",
      noGroupVariables: "No hay variables {label}.",
      searchPlaceholder: "Buscar variables...",
      noVariables: "No hay variables disponibles.",
      close: "Cerrar",
    },
  },
};
