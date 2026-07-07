<script lang="ts">
import type { TrueColor } from "../theme/Theme";

// ── Props ──────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, signal?: AbortSignal) => void;
  onClear?: () => void;
  debounceMs?: number;
  autoSearch?: boolean;
  className?: string;
  disabled?: boolean;
  initialValue?: string;
  shouldClear?: boolean;
  leadingIcon?: string;
  variant?: "default" | "gradient";
  color?: TrueColor;
  gradientFrom?: string;
  gradientTo?: string;
  glowIntensity?: "subtle" | "soft" | "medium" | "strong";
}

// Placeholder component — full template is in the app that consumes this kit.
const SearchBar = {} as import("vue").Component;

export default SearchBar;
</script>
