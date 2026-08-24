# Build targets for the ui-kit monorepo: react/ (@cjlapao/ui-kit),
# vue/ (@cjlapao/ui-kit-vue) and their demo apps.
# Naming: every framework-specific target carries a -react or -vue suffix;
# the unsuffixed target runs both.
# All dev/preview targets bind to 0.0.0.0 so the demos are reachable from anywhere on the network.

.PHONY: all build build-react build-vue build-demo build-demo-react build-demo-vue dev-react dev-vue serve-react serve-vue install install-react install-vue install-src-react install-demo-react install-src-vue install-demo-vue publish publish-react publish-vue publish-npmjs publish-github publish-npmjs-react publish-npmjs-vue publish-github-react publish-github-vue publish-dry-run publish-dry-run-react publish-dry-run-vue version-check auth-check auth-check-npmjs auth-check-github

# Dist-tag applied by the publish targets: make publish NPM_TAG=next
NPM_TAG ?= latest
# Extra flags forwarded to npm publish: make publish NPM_FLAGS=--otp=123456
NPM_FLAGS ?=
# Every publish target passes --registry explicitly, which overrides the
# publishConfig.registry in each package.json. package.json is left alone so
# .github/workflows/publish.yml keeps publishing to GitHub Packages unchanged.
REGISTRY_NPMJS  ?= https://registry.npmjs.org
REGISTRY_GITHUB ?= https://npm.pkg.github.com

NPM_PUBLISH = npm publish --tag $(NPM_TAG) $(NPM_FLAGS) --registry

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

## Fail unless VERSION, react/package.json and vue/package.json agree
version-check:
	@v=$$(cat VERSION); \
	r=$$(node -p "require('./react/package.json').version"); \
	u=$$(node -p "require('./vue/package.json').version"); \
	if [ "$$v" != "$$r" ] || [ "$$v" != "$$u" ]; then \
		echo "version mismatch: VERSION=$$v react=$$r vue=$$u" >&2; exit 1; \
	fi; \
	echo "publishing version $$v"

## Report which registries this machine is authenticated against
auth-check: auth-check-npmjs auth-check-github

auth-check-npmjs:
	@npm whoami --registry=$(REGISTRY_NPMJS) >/dev/null 2>&1 \
		|| { echo "not logged in to $(REGISTRY_NPMJS) — run: npm login --registry=$(REGISTRY_NPMJS)" >&2; exit 1; }
	@echo "npmjs:  $$(npm whoami --registry=$(REGISTRY_NPMJS))"

auth-check-github:
	@npm whoami --registry=$(REGISTRY_GITHUB) >/dev/null 2>&1 \
		|| { echo "not logged in to $(REGISTRY_GITHUB) — add a GitHub PAT with write:packages to ~/.npmrc as //npm.pkg.github.com/:_authToken=<PAT>" >&2; exit 1; }
	@echo "github: $$(npm whoami --registry=$(REGISTRY_GITHUB))"

## Publish both libraries to both registries (all auth checked up front)
publish: version-check auth-check publish-npmjs publish-github

## Both libraries to one registry
publish-npmjs: publish-npmjs-react publish-npmjs-vue
publish-github: publish-github-react publish-github-vue

## One library to both registries
publish-react: publish-npmjs-react publish-github-react
publish-vue: publish-npmjs-vue publish-github-vue

publish-npmjs-react: version-check auth-check-npmjs build-react
	cd react && $(NPM_PUBLISH)=$(REGISTRY_NPMJS)

publish-npmjs-vue: version-check auth-check-npmjs build-vue
	cd vue && $(NPM_PUBLISH)=$(REGISTRY_NPMJS)

publish-github-react: version-check auth-check-github build-react
	cd react && $(NPM_PUBLISH)=$(REGISTRY_GITHUB)

publish-github-vue: version-check auth-check-github build-vue
	cd vue && $(NPM_PUBLISH)=$(REGISTRY_GITHUB)

## Pack both libraries without publishing — prints the exact file list
publish-dry-run: version-check publish-dry-run-react publish-dry-run-vue

publish-dry-run-react: build-react
	cd react && npm publish --dry-run --tag $(NPM_TAG) $(NPM_FLAGS) --registry=$(REGISTRY_NPMJS)

publish-dry-run-vue: build-vue
	cd vue && npm publish --dry-run --tag $(NPM_TAG) $(NPM_FLAGS) --registry=$(REGISTRY_NPMJS)

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
