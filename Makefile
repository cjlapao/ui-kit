# Build targets for @cjlapao/ui-kit and the demo app.
# All dev/preview targets bind to 0.0.0.0 so the demo is reachable from anywhere on the network.

.PHONY: build build-demo dev serve

# Default: build both the library and the demo
all: build build-demo

## Build the library
build:
	npm run build

## Build the demo (static output into demo/build/)
build-demo:
	cd demo && npm run build

## Dev: serve the demo on 0.0.0.0 (watch mode, hot reload)
dev:
	cd demo && npx vite --host 0.0.0.0

## Preview the built demo on 0.0.0.0
serve: build-demo
	cd demo && npx vite preview --host 0.0.0.0
