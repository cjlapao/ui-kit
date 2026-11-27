# Aeon loading animation

Create a self-contained animated SVG based on the supplied Aeon two-tone infinity logo. It must work when embedded as an SVG image in either the React or Vue application, without JavaScript or external assets.

The blue and magenta strokes grow along their existing paths from the center. The four outer nodes appear as their respective paths reach them, followed by the center node and the pale outline. The completed logo holds briefly, then the sequence repeats for use as an indeterminate loading indicator. The SVG retains the original geometry, colors, gradients, and shadow, and scales using its viewBox.

For users who prefer reduced motion, show the completed logo without animation. Give the SVG an accessible loading label. Verify that the SVG parses and visually check the beginning, intermediate, and completed states in a browser when available.
