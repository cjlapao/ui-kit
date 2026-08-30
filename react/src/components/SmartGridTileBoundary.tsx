import React from "react";
import EmptyState from "./EmptyState";
import type { TrueColor } from "../theme";

/**
 * Calls the tile's own render function.
 *
 * It has to be a *component* rather than a call in the parent: an error
 * boundary only catches what its children throw while rendering, and
 * `{def.render()}` is evaluated in the parent's render, before the boundary
 * has mounted. Deferring the call into a child puts the throw inside the
 * boundary's subtree, where it can be caught.
 */
const TileContent: React.FC<{ render: () => React.ReactNode }> = ({
  render,
}) => <>{render()}</>;

interface Props {
  /** Shown in the fallback so a broken tile is identifiable. */
  title: string;
  tone?: TrueColor;
  onError?: (error: Error, title: string) => void;
  /** The tile's render function, invoked inside the boundary. */
  render: () => React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Isolates one dashboard tile.
 *
 * Tiles are arbitrary consumer components rendered through
 * `SmartGridItemDefinition.render()`. Without a boundary, one throwing tile
 * unmounts the entire dashboard — the user loses every other tile, and the
 * layout editor with them, because of a single failed data fetch.
 *
 * A class component because React still has no hook equivalent of
 * `componentDidCatch`.
 */
class SmartGridTileBoundaryImpl extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    this.props.onError?.(error, this.props.title);
  }

  componentDidUpdate(prev: Props): void {
    // A tile that failed once should get another chance when it is re-keyed or
    // its identity changes, rather than being stuck showing the fallback.
    if (prev.title !== this.props.title && this.state.error) {
      this.setState({ error: null });
    }
  }

  render(): React.ReactNode {
    if (this.state.error) {
      return (
        <div className="flex h-full items-center justify-center p-2">
          <EmptyState
            icon="Error"
            title={this.props.title}
            subtitle="This tile failed to render."
            showIcon
            variant="plain"
            size="sm"
            iconColor="rose"
            color={this.props.tone ?? "rose"}
          />
        </div>
      );
    }
    return <TileContent render={this.props.render} />;
  }
}

/**
 * Memoised, because the grid re-renders on every frame of a drag or a resize —
 * `setLayout` fires per `mousemove` — and without this every tile's `render()`
 * ran again each time. On a dashboard of charts that is the difference between
 * a smooth drag and a slideshow.
 *
 * The props are all stable for a given tile: `render` comes from the caller's
 * item definition, `title` and `tone` are strings. A tile only re-renders when
 * one of those actually changes, which is what a shallow compare gives.
 */
export const SmartGridTileBoundary = React.memo(SmartGridTileBoundaryImpl);

export default SmartGridTileBoundary;
