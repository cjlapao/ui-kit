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
      loading: "Carregando…",
    },
    datepicker: {
      today: "Hoje",
      clear: "Limpar",
      chooseMonth: "Escolher mês",
      chooseYear: "Escolher ano",
      panelAriaLabel: "Escolher uma data",
      panelAriaLabelRange: "Escolher um intervalo de datas",
      chooseMonthNow: "Escolher m\u00eas, agora {month} {year}",
      chooseYearNow: "Escolher ano, agora {year}",
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
      confirm: "Confirmar",
      delete: "Excluir",
      confirmValueLabel: "nome",
      typeValuePrefix: "Digite o",
      typeValueSuffix: "para confirmar:",
      back: "Voltar",
    },
    modal: {
      cancel: "Cancelar",
      closeAria: "Fechar diálogo",
      confirm: "Confirmar",
      delete: "Excluir",
      apply: "Aplicar",
      confirmValueLabel: "nome",
      typeValuePrefix: "Digite o",
      typeValueSuffix: "para confirmar:",
      back: "Voltar",
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
      placeholder: "Buscar...",
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
      closeAria: "Fechar painel",
      resize: "Redimensionar painel",
    },
    smartgrid: {
      searchAria: "Buscar itens",
      searchPlaceholder: "Buscar itens",
      addItems: "Adicionar itens",
      close: "Fechar",
      closeAria: "Fechar a paleta de itens",
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
      title: "Inserir variável",
      noMatches: "Nada corresponde a “{term}”.",
      noGroupVariables: "Nenhuma variável {label}.",
      searchPlaceholder: "Buscar variáveis...",
      noVariables: "Nenhuma variável disponível.",
      close: "Fechar",
    },
  },
};
