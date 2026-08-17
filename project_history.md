# Project Work History

## 2026-05-26 – Product Service Dependency Fixes (Phase 3)
- Fixed duplicate `@nestjs/cli` entry and removed stray commas in `product-service/package.json`.
- Ran `npm install` after cleaning `node_modules`; encountered an "Invalid Version" error, pending investigation.
- Planned to verify versions and re‑run installation.

## 2026-07-13 – Phase 1 Major Progress (Session 3)

### What was done
- **Diagnosed root cause** of npm "Invalid Version" error: `package-lock.json` was truncated/corrupted → deleted it
- **Rewrote `product-service` completely:**
  - Added `product.entity.ts` (TypeORM entity with `id, name, description, price, sku, stock, isActive, createdAt, updatedAt`)
  - Rewrote `product.service.ts` — PostgreSQL-backed via TypeORM repository
  - Rewrote `product.controller.ts` — added `ParseIntPipe`, `@ApiTags`, `@ApiOperation`, soft-delete
  - Rewrote `product.dto.ts` — `CreateProductDto` + `UpdateProductDto` with `class-validator` decorators
  - Rewrote `app.module.ts` — TypeOrmModule configured from env vars
  - Rewrote `main.ts` — added Swagger at `/api/docs`, global `ValidationPipe`
  - Rewrote `package.json` — pinned all versions, added TypeORM 0.3.20, pg 8.12.0, class-validator, class-transformer
- **Updated `catalog-service`:**
  - Added Swagger to `main.ts`
  - Added `@ApiTags` / `@ApiOperation` to controller
  - Updated health response to include `service` field
  - Rewrote `package.json` with pinned versions
- **Rewrote `docker-compose.yml`:**
  - Fixed Keycloak `KC_DB: dev-mem` (was `dev` — invalid)
  - Upgraded Keycloak to 24.0.4, Kong to 3.7-ubuntu
  - Added healthchecks to postgres, redis, elasticsearch, keycloak, kong, both services
  - Added Kong admin port 8001
  - product-service now `depends_on: postgres: condition: service_healthy`
- **Rewrote `infra/kong/kong.yaml`:** Format 3.0, added rate-limiting + CORS global plugins
- **Fixed both Dockerfiles:** Added `curl` for healthchecks
- **Wrote `.github/workflows/ci.yml`:** Lint + build + test + Docker build + Trivy security scan for both services

### Session interrupted
- `npm install` was running in background for both services when system restart was required
- **Next session must start with:** `npm install` + `npm run build` for both services

### Next session setup completed
- Successfully ran `npm install` and `npm run build` for both `catalog-service` and `product-service`.

*Further entries will be appended as milestones are achieved.*
