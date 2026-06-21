.PHONY: help install dev typecheck lint build build-hosted preview test verify deploy-vercel deploy-vercel-prod clean

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
	@echo "  make build-hosted     Build with NAZAYA_RUNTIME=hosted (Vercel)"
	@echo "  make preview          Serve static export locally"
	@echo ""
	@echo "Testing:"
	@echo "  make test             Run e2e tests (Playwright)"
	@echo "  make verify           Run typecheck + lint + build + test"
	@echo ""
	@echo "Deployment:"
	@echo "  make deploy-vercel    Deploy to Vercel preview/staging"
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
build:
	npm run build

# Build with hosted runtime (Vercel)
build-hosted:
	NAZAYA_RUNTIME=hosted npm run build

# Serve static export locally (tests Pages deployment)
preview:
	npm run serve:static

# Run e2e tests
test:
	npm run test:e2e

# Verify: typecheck + lint + build + test
verify: typecheck lint build test

# Deploy to Vercel (preview/staging)
deploy-vercel:
	vercel deploy

# Deploy to Vercel production
deploy-vercel-prod:
	vercel pull --yes && vercel build --prod && vercel deploy --prebuilt --prod

# Clean build artifacts
clean:
	rm -rf .next out
