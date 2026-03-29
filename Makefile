# Brain UI — SvelteKit memory browser for Shipwright Brain
# Usage: make help

FILES ?=

.PHONY: help dev build lint format check typecheck test clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start dev server
	npm run dev

build: ## Production build
	npm run build

lint: ## Lint (prettier + eslint)
ifdef FILES
	npx prettier --check $(FILES)
	npx eslint $(FILES)
else
	npm run lint
endif

format: ## Format code (prettier)
ifdef FILES
	npx prettier --write $(FILES)
else
	npm run format
endif

typecheck: ## Run svelte-check
	npm run check

check: lint typecheck ## Run all checks (lint + typecheck)

test: ## Run unit tests
	npm run test

clean: ## Remove build artifacts
	rm -rf .svelte-kit build node_modules/.vite
