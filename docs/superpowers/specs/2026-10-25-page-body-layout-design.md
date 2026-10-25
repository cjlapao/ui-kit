# Page body layout

Approved arrangement: header above a body with full-height left/right regions, a centre, and a bottom region beneath only the centre. Regions reserve space in normal flow. Each collapses independently; the right and bottom resize by pointer and keyboard by default. The left may opt into resizing.

PageBodyLayout accepts header/left/right/bottom/children. Region configuration provides an accessible label, node or render function, initial or controlled size/collapse, bounds, collapsed dimension, resize option and toggle visibility. Render functions receive collapsed/setCollapsed/size to integrate the workflow rail's existing control. Static content remains mounted but hidden/inert when collapsed. Expanded dimensions survive collapse. Optional slots may be omitted.

The layout uses the shared Panel surface variants. Consumers give it a bounded height; centre and regions scroll independently. Minimum centre dimensions are preserved by allowing the workspace to scroll when the container cannot fit all regions. Right arrows and bottom arrows mirror pointer motion; Home/End choose limits. Drag completion, cancellation and unmount restore document cursor and selection styles.

SidePanel's new docked option fills its assigned region in flow and suppresses its own overlay/resize handle. The layout owns dimensions and collapse controls for these docked panels. Existing overlay usage retains its behavior.

PageHeader gains the shared surface family, tone and glass options using Panel for surface rendering. Existing default/floating/floating-glass treatments retain compatibility. Existing start/center/end and gutter APIs remain available. Shared variant names are exported through PAGE_HEADER_VARIANTS.

A documentation page demonstrates a real collapsible workflow rail, centre activity, a resizable Files panel and a resizable Terminal beneath the centre, with shared variant selection. Tests cover structure, pointer/keyboard resize, controlled state, mounted child preservation, shared header variants and docked panel semantics.
