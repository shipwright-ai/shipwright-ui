# Brain UI — SvelteKit memory browser for Shipwright Brain
# Usage: make help

FILES ?=

BRAIN_SERVER = node ../shipwright-brain/src/http.js ./docs

.PHONY: help dev build lint format check typecheck test clean up down brain

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

up: ## Start Brain API + dev server
	$(BRAIN_SERVER) & echo "Brain API: http://localhost:3111" && npm run dev

down: ## Stop Brain API
	@-pkill -f "shipwright-brain/src/http.js" 2>/dev/null || true
	@echo "Brain API stopped"

brain: ## Start Brain API only
	$(BRAIN_SERVER)

dev: ## Start dev server only (Brain must be running)
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
