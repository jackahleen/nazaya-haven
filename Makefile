.PHONY: help install dev typecheck lint build build-static build-hosted preview test test-static test-static-chromium test-button-proofs test-hosted-api test-runtime test-browserbase demo-record verify verify-pages verify-static verify-hosted verify-deploy deploy-vercel deploy-vercel-preview deploy-vercel-prod redis-up redis-down redis-cli redis-logs dev-redis cache-demo clean

# Default target: show help
help:
	@echo "Nazaya Haven - Build & Deploy Targets"
	@echo ""
	@echo "Local Development:"
	@echo "  make dev              Start dev server (next dev --turbopack)"
	@echo "  make typecheck        Run TypeScript type checker"
	@echo "  make lint             Run ESLint"
	@echo "  make install          Install dependencies (npm ci)"
	@echo ""
	@echo "Redis (Local):"
	@echo "  make redis-up         Start Redis Stack (docker compose up -d redis)"
	@echo "  make redis-down       Stop Redis Stack (docker compose down)"
	@echo "  make redis-cli        Open redis-cli in running container"
	@echo "  make redis-logs       View Redis logs"
	@echo "  make dev-redis        Run hosted dev against local Redis (REDIS_URL=redis://localhost:6379)"
	@echo "  make cache-demo       Prove cache hit: redis-up, build, start, dual curl to /api/resources/"
	@echo ""
	@echo "Building:"
	@echo "  make build            Build static export (GitHub Pages)"
	@echo "  make build-static     Build static export (GitHub Pages)"
	@echo "  make build-hosted     Build with NAZAYA_RUNTIME=hosted (Vercel)"
	@echo "  make preview          Serve static export locally"
	@echo ""
	@echo "Testing:"
	@echo "  make test             Run static e2e tests (Playwright)"
	@echo "  make test-static      Run static e2e tests (Playwright)"
	@echo "  make test-button-proofs Run visible button proof suite"
	@echo "  make test-hosted-api  Run hosted/Vercel API proof suite"
	@echo "  make test-runtime     Run focused static/runtime fallback tests"
	@echo "  make test-browserbase Run Browserbase cloud smoke lane"
	@echo "  make demo-record      Record a local walkthrough video"
	@echo "  make verify           Run typecheck + lint + build + test"
	@echo "  make verify-pages     Run typecheck + lint + static Pages build"
	@echo "  make verify-static    Run verify-pages + static e2e tests"
	@echo "  make verify-hosted    Run typecheck + lint + hosted build"
	@echo "  make verify-deploy    Run static, hosted, and Browserbase lanes"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-vercel    Deploy to Vercel preview/staging"
	@echo "  make deploy-vercel-preview Alias for deploy-vercel"
	@echo "  make deploy-vercel-prod Deploy to Vercel production"
	@echo "  make deploy-pages     Deploy to GitHub Pages (via git push main + workflow)"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            Remove build artifacts (.next, out)"

# Install dependencies
install:
	npm ci

# Local development with Turbopack
dev:
	npm run dev

# Type checking
typecheck:
	npm run typecheck

# Linting
lint:
	npm run lint

# Build static export (default for GitHub Pages)
build: build-static

build-static:
	npm run build:static

# Build with hosted runtime (Vercel)
build-hosted:
	npm run build:hosted

# Serve static export locally (tests Pages deployment)
preview:
	npm run serve:static

# Run e2e tests
test: test-static

test-static:
	npm run test:static

test-static-chromium:
	npm run test:static:chromium

test-button-proofs:
	npm run test:button-proofs

test-hosted-api:
	npm run test:hosted-api

test-runtime:
	npm run test:runtime

test-browserbase:
	npm run test:browserbase

demo-record:
	npm run demo:record

# Verify: typecheck + lint + build + test
verify:
	npm run verify

verify-pages:
	npm run verify:pages

verify-static:
	npm run verify:static

verify-hosted:
	npm run verify:hosted

verify-deploy:
	npm run verify:deploy

# Deploy to Vercel (preview/staging)
deploy-vercel:
	vercel deploy

deploy-vercel-preview: deploy-vercel

# Deploy to Vercel production
deploy-vercel-prod:
	vercel pull --yes && vercel build --prod && vercel deploy --prebuilt --prod

# GitHub Pages deployment note (via git push main to trigger workflow)
deploy-pages:
	@echo "GitHub Pages deploys automatically when you push to 'main' branch."
	@echo "The 'pages.yml' workflow builds the static export and publishes to gh-pages."
	@echo "Push with: git push origin main"

# Redis Stack commands (requires Docker)
redis-up:
	docker compose up -d redis

redis-down:
	docker compose down

redis-cli:
	docker exec -it nazaya-redis redis-cli -a local-dev

redis-logs:
	docker compose logs -f redis

# Dev server against local Redis (requires redis-up first)
dev-redis:
	REDIS_URL=redis://:local-dev@localhost:6379 npm run build:hosted && npm start

# Cache-hit demo: start Redis, build hosted, run server, and prove cache headers
cache-demo: redis-up
	@echo "Redis Stack started. Building hosted runtime..."
	REDIS_URL=redis://:local-dev@localhost:6379 npm run build:hosted
	@echo "Starting server in background..."
	REDIS_URL=redis://:local-dev@localhost:6379 npm start &
	@sleep 3
	@echo "Testing cache hit on /api/resources/ endpoint..."
	@echo ""
	@echo "First request (cache miss):"
	curl -s -i -X POST http://localhost:3000/api/resources/ 2>&1 | grep -i "x-nazaya-cache" || echo "(x-nazaya-cache header not found or endpoint not available)"
	@echo ""
	@echo "Second request (cache hit):"
	curl -s -i -X POST http://localhost:3000/api/resources/ 2>&1 | grep -i "x-nazaya-cache" || echo "(x-nazaya-cache header not found or endpoint not available)"
	@echo ""
	@echo "Server running on http://localhost:3000. Press Ctrl+C to stop."

# Clean build artifacts
clean:
	rm -rf .next out
