# Identity picker and file upload

Approved structure: two React components share the local file selection and preview foundation. IdentityPicker offers emoji, image and monogram modes. FileUpload is the simpler file-only control. Both follow the kit's shared variants, tones, control sizes, padding, corners and glass options, and provide disabled/loading/error states.

IdentityPicker returns a discriminated IdentityValue: emoji with a Unicode string, image with a local File (or persisted src URL), monogram with text, or null on reset. Controlled and initial internal state are supported. The preview derives automatic initials from name when no explicit identity is chosen. Emoji use a configurable font stack and a small bundled catalogue with category, label, keywords and recommended metadata; applications can supply/localize their own catalogue. Search covers the full catalogue. Native buttons and arrow keys operate the emoji results. Each picker instance gives its tabs unique ids.

FileUpload returns File[]. Native browse and drag/drop share type, byte-size and count checks. Single mode replaces selection; multiple mode appends valid files and reports invalid files independently through structured type/size/count rejections. Removing files emits the remaining selection. A cancelled or entirely invalid selection does not erase existing files. The same file can be selected again because the input resets after every change.

Temporary preview URLs belong to the preview component and are revoked on replacement/unmount. SVG preview content passes through the kit's sanitizer before a preview Blob is created. Original File values remain available to the application for its upload flow. No remote upload or font download is performed. Persisted image URLs are application-owned. Unsupported/broken previews fall back to a file glyph.

Identity image selection accepts SVG/PNG up to 5 MB by default. FileUpload accepts arbitrary files with no byte limit by default, one file in single mode or up to 20 in multiple mode. Applications may override limits and copy, including localized validation messages. Labels expose the user-facing strings, while supplied emoji categories/labels are application-owned metadata.

Both documentation pages use the standard PlaygroundPanel/ControlAccordion pattern with surface settings, state toggles and event logs. Tests cover selections, rejection reasons, controlled values, monograms, custom emoji search, reset, disabled/loading interactions, SVG previews and temporary URL cleanup. Finish with React type/lint checks, browser review, and a rebuilt package.


Refinement: IdentityPicker gives its tab bar an independent neutral container and consistent padded content across all three modes. FileUpload supports embedded rendering to avoid nested tint/borders, and drop handling accepts both DataTransfer.files and file-kind DataTransfer.items. Filled active Tabs omit inactive hover colour classes, preserving selected-label contrast on hover.


Density refinement: size scales the complete identity control through xs/sm/md/lg/xl, including the preview image/emoji/initials, grid glyphs and targets, header/body typography, panel spacing, grid height and action buttons. FileUpload uses the same size input for its dropzone, file glyph, thumbnails, metadata and remove controls. Explicit outer surface padding and corner props remain independent. Changing size preserves the selected value and active tab.


Compact layout: IdentityPicker defaults compact=true independently of its size. Search and a category select share one toolbar, spacing is reduced, and the emoji viewport is shorter. Image upload uses FileUpload's compact horizontal prompt; monogram input/action share a row. compact=false retains the category-chip and stacked layout. FileUpload's own compact option defaults false and hides its empty-file caption, while keeping selected files and errors visible. At medium size with the same explicit surface padding, the recommended view measures about 328px instead of 412px in the docs preview.
