.PHONY: help install dev typecheck lint build build-static build-hosted preview test test-static test-static-chromium test-runtime test-browserbase verify verify-pages verify-static verify-hosted verify-deploy deploy-vercel deploy-vercel-preview deploy-vercel-prod clean

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
	@echo "Building:"
	@echo "  make build            Build static export (GitHub Pages)"
	@echo "  make build-static     Build static export (GitHub Pages)"
	@echo "  make build-hosted     Build with NAZAYA_RUNTIME=hosted (Vercel)"
	@echo "  make preview          Serve static export locally"
	@echo ""
	@echo "Testing:"
	@echo "  make test             Run static e2e tests (Playwright)"
	@echo "  make test-static      Run static e2e tests (Playwright)"
	@echo "  make test-runtime     Run focused static/runtime fallback tests"
	@echo "  make test-browserbase Run Browserbase cloud smoke lane"
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

test-runtime:
	npm run test:runtime

test-browserbase:
	npm run test:browserbase

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

# Clean build artifacts
clean:
	rm -rf .next out
