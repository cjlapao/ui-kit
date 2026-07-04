# Build targets for the ui-kit monorepo: react/ (@cjlapao/ui-kit),
# vue/ (@cjlapao/ui-kit-vue) and their demo apps.
# Naming: every framework-specific target carries a -react or -vue suffix;
# the unsuffixed target runs both.
# All dev/preview targets bind to 0.0.0.0 so the demos are reachable from anywhere on the network.

.PHONY: all build build-react build-vue build-demo build-demo-react build-demo-vue dev-react dev-vue serve-react serve-vue install install-react install-vue install-src-react install-demo-react install-src-vue install-demo-vue

# Default: build both libraries and both demos
all: build build-demo

## Install dependencies in all packages (src + demo for both frameworks)
install: install-react install-vue

## Install dependencies in the React library (react/src) and demo (react/demo)
install-react: install-src-react install-demo-react

## Install dependencies in the Vue library (vue/src) and demo (vue/demo)
install-vue: install-src-vue install-demo-vue

## Install dependencies in the React library source (react/src)
install-src-react:
	cd react/src && npm install

## Install dependencies in the React demo app (react/demo)
install-demo-react:
	cd react/demo && npm install

## Install dependencies in the Vue library source (vue/src)
install-src-vue:
	cd vue/src && npm install

## Install dependencies in the Vue demo app (vue/demo)
install-demo-vue:
	cd vue/demo && npm install

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
