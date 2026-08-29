// Curated initial Portuguese kit catalog (spec §4.3 / §15: initial
// translations, author-written, overridable per key).
import type { MessageCatalog } from "../types";

export const PT_KIT_CATALOG: MessageCatalog = {
  kit: {
    accordion: {
      loadingTitle: "Carregando",
      noItemsTitle: "Sem itens",
    },
    combobox: {
      emptyMessage:
        "Nenhuma opção correspondente. Continue digitando para usar o que você digitou.",
      clear: "Limpar",
      showOptions: "Mostrar opções",
    },
    datepicker: {
      today: "Hoje",
      clear: "Limpar",
      chooseMonth: "Escolher mês",
      chooseYear: "Escolher ano",
      panelAriaLabel: "Escolher uma data",
      panelAriaLabelRange: "Escolher um intervalo de datas",
      accessibleNameFallback: "Data",
    },
    help: {
      show: "Mostrar ajuda",
      close: "Fechar ajuda",
      panelTitle: "Ajuda",
    },
    inforow: {
      loading: "Carregando",
    },
    inlinepanel: {
      cancel: "Cancelar",
      close: "Fechar",
    },
    modal: {
      cancel: "Cancelar",
      closeAria: "Fechar diálogo",
    },
    notificationmodal: {
      action: "Fechar",
    },
    pagedpanel: {
      empty: "Nenhum dado disponível.",
    },
    pill: {
      remove: "Remover",
    },
    progressspinner: {
      loading: "Carregando",
    },
    searchbar: {
      clearAria: "Limpar busca",
    },
    sidemenu: {
      openSidebar: "Abrir barra lateral",
      searchPlaceholder: "Buscar",
      searchAria: "Buscar itens do menu",
      closeAria: "Fechar menu",
      collapse: "Recolher",
      expandSidebar: "Expandir barra lateral",
      collapseSidebar: "Recolher barra lateral",
      verbCollapse: "Recolher",
      verbExpand: "Expandir",
      toggleSubmenu: "{verb} o submenu {label}",
    },
    sidepanel: {
      close: "Fechar",
      closeAria: "Fechar painel",
      resize: "Redimensionar painel",
    },
    smartgrid: {
      searchAria: "Buscar itens",
      searchPlaceholder: "Buscar itens",
      addItems: "Adicionar itens",
      close: "Fechar",
    },
    spinner: {
      loading: "Carregando",
    },
    table: {
      empty: "Nenhum dado para exibir",
    },
    toast: {
      closeAria: "Fechar notificação",
    },
    variablepicker: {
      searchPlaceholder: "Buscar variáveis...",
      noVariables: "Nenhuma variável disponível.",
      close: "Fechar",
    },
  },
};
