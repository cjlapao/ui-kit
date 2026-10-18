// Demo-owned user catalog for the i18n docs page (user namespace only —
// kit.* strings fall back to the built-in catalog). `ar` exercises RTL +
// Arabic plural categories (zero/one/two/few/many/other) via Intl.PluralRules.
import type { MessageCatalog } from "@cjlapao/ui-kit";

export const DEMO_LOCALES: Record<string, MessageCatalog> = {
  en: {
    greeting: "Hello, {name}!",
    items: "{count, plural, one {# item in your cart} other {# items in your cart}}",
    "welcome.title": "Welcome to the ui-kit i18n demo",
    "welcome.body": "Everything on this page renders through the same engine the kit components use.",
  },
  fr: {
    greeting: "Bonjour, {name} !",
    items: "{count, plural, one {# article dans votre panier} other {# articles dans votre panier}}",
    "welcome.title": "Bienvenue dans la démo i18n du ui-kit",
    "welcome.body": "Tout sur cette page est rendu par le même moteur que les composants du kit.",
  },
  es: {
    greeting: "¡Hola, {name}!",
    items: "{count, plural, one {# artículo en tu carrito} other {# artículos en tu carrito}}",
    "welcome.title": "Bienvenido a la demo i18n del ui-kit",
    "welcome.body": "Todo en esta página se renderiza con el mismo motor que usan los componentes del kit.",
  },
  ar: {
    greeting: "مرحبًا، {name}!",
    items:
      "{count, plural, zero {لا توجد عناصر في سلة التسوق} one {عنصر واحد في سلة التسوق} two {عنصران في سلة التسوق} few {# عناصر في سلة التسوق} many {# عنصرًا في سلة التسوق} other {# عنصر في سلة التسوق}}",
    "welcome.title": "مرحبًا بك في العرض التجريبي",
    "welcome.body": "كل شيء في هذه الصفحة يُعرض من خلال نفس المحرك الذي تستخدمه مكونات الكيت.",
  },
};

export const DEMO_LOCALE_TAGS = Object.keys(DEMO_LOCALES);
