# Table body scrolling

Approved design: keep column headers, toolbar, and footer outside the body scroll viewport. Use ScrollArea for horizontal and vertical body scrolling; synchronize the header horizontally. Share measured column widths across header and body, including grouping spacers, declared widths, and resized columns. Preserve sorting, grouping, resizing, sticky columns, loading, and pagination.

Use opaque header and footer fills for ordinary panel surfaces. Explicit glass surfaces retain their translucent chrome. Extend fullHeight to fill a bounded parent in both dimensions with shrinking flex children; unconstrained tables retain natural height. maxHeight continues to constrain the content region.

Update the React playground with a bounded, resizable parent and document sizing requirements. Verify header exclusion from the viewport, horizontal synchronization, sizing, surfaces, existing table interactions, and ScrollArea behavior.
