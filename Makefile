# Build targets for the ui-kit monorepo: react/ (@cjlapao/ui-kit),
# vue/ (@cjlapao/ui-kit-vue) and their demo apps.
# Naming: every framework-specific target carries a -react or -vue suffix;
# the unsuffixed target runs both.
# All dev/preview targets bind to 0.0.0.0 so the demos are reachable from anywhere on the network.

.PHONY: all build build-react build-vue build-demo build-demo-react build-demo-vue dev-react dev-vue serve-react serve-vue

# Default: build both libraries and both demos
all: build build-demo

## Build both libraries
build: build-react build-vue

build-react:
	cd react && npm run build

build-vue:
	cd vue && npm run build

## Build both demos
build-demo: build-demo-react build-demo-vue

## Build the React demo (static output into react/demo/build/)
build-demo-react:
	cd react/demo && npm run build

## Build the Vue demo (static output into vue/demo/build/)
build-demo-vue:
	cd vue/demo && npm run build

## Dev: serve the React demo on 0.0.0.0 (watch mode, hot reload)
dev-react:
	cd react/demo && npx vite --host 0.0.0.0

## Dev: serve the Vue demo on 0.0.0.0
dev-vue:
	cd vue/demo && npx vite --host 0.0.0.0

## Preview the built React demo on 0.0.0.0
serve-react: build-demo-react
	cd react/demo && npx vite preview --host 0.0.0.0

## Preview the built Vue demo on 0.0.0.0
serve-vue: build-demo-vue
	cd vue/demo && npx vite preview --host 0.0.0.0
