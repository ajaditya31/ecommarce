---
inclusion: always
---

# Project Memory Map – Multi-Vendor E-Commerce Platform

> This file is auto-injected into every Kiro session. **Never re-scan the project from scratch.** Read this first, then act.

---

## 1. Project Identity

| Key | Value |
|-----|-------|
| Root | `d:\ecommarce\` |
| Type | Multi-vendor marketplace (seller-centric) |
| Architecture | Microservices monorepo |
| Backend | NestJS (TypeScript) |
| Frontend | Next.js (React) — not yet scaffolded |
| API Gateway | Kong (declarative, DB-less mode) |
| Auth | Keycloak (OIDC) |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Messaging | Kafka (Bitnami) + Zookeeper |
| Search | Elasticsearch 8.10 |
| Feature Flags | Unleash (self-hosted, not yet deployed) |
| CI/CD | GitHub Actions (`.github/workflows/`) |
| Infra-as-Code | Terraform (planned, not yet written) |
| Containers | Docker Compose for local dev; Kubernetes (EKS/GKE) for prod |

---

## 2. Repository Layout

```
d:\ecommarce\
├── .github/workflows/          # CI pipelines (skeleton only)
├── design/                     # Empty – UI design assets go here
├── discussion/                 # Architecture docs & decisions (read-only reference)
│   ├── consolidated_feature_set.md
│   ├── implementation_plan.md
│   ├── roadmap_detail.md
│   ├── scalable_architecture.md
│   ├── design_system.md
│   ├── admin_journeys.md
│   ├── seller_journeys.md
│   ├── user_journeys.md
│   ├── ecommerce_platform_analysis.md
│   ├── giant_features_review.md
│   └── open_source_cms_review.md
├── docs/                       # Empty – generated docs go here
├── frontend/                   # Empty – Next.js PWA (not yet scaffolded)
├── infra/
│   └── kong/kong.yaml          # Kong declarative config (routes defined)
├── services/
│   ├── catalog-service/        # Phase 1 hello-world – COMPLETE
│   └── product-service/        # Phase 2 CRUD – IN PROGRESS (build issue)
├── docker-compose.yml          # Full local stack definition
├── project_history.md          # Chronological work log – UPDATE after each session
└── README.md
```

---

## 3. Service Registry

### catalog-service (Port 3000) — STATUS: ✅ Updated & ready to build
- **Purpose:** Hello-world / health check service (Phase 1)
- **Key files:** `src/app.module.ts`, `src/catalog.controller.ts`, `src/catalog.service.ts`, `src/main.ts`
- **Endpoints:** `GET /health` → `{ status: 'OK', service: 'catalog-service' }`, `GET /` hello world
- **Swagger:** `GET /api/docs`
- **Storage:** None (stateless)
- **Known issues:** None — package.json rewritten with pinned versions
- **Build cmd:** `npm install` then `npm run build`
- **package.json:** Pinned versions (NestJS 10.3.10, Swagger 7.3.1, TS 5.5.3) — no lock file yet, will generate on first `npm install`

### product-service (Port 3001) — STATUS: ✅ Fully rewritten, npm install was running at restart
- **Purpose:** Full CRUD for products, PostgreSQL-backed via TypeORM
- **Key files:** `src/product.controller.ts`, `src/product.service.ts`, `src/product.dto.ts`, `src/product.entity.ts`, `src/app.module.ts`, `src/main.ts`
- **Endpoints:**
  - `GET /products/health` → `{ status: 'OK', service: 'product-service' }`
  - `GET /products` — list all active products (from PostgreSQL)
  - `GET /products/:id`
  - `POST /products`
  - `PUT /products/:id`
  - `DELETE /products/:id` — soft delete (sets `isActive=false`)
- **Swagger:** `GET /api/docs`
- **Storage:** PostgreSQL via TypeORM (`synchronize: true` in dev — auto-creates `products` table)
- **Routed via Kong:** `paths: [/products]`
- **Known issues:** `npm install` was in-progress at system restart — run it again after reboot
- **DTO:** `CreateProductDto { name, description?, price, sku?, stock? }` with class-validator decorators
- **Entity:** `Product { id, name, description, price, sku, stock, isActive, createdAt, updatedAt }`
- **package.json:** Fully rewritten — pinned versions, added TypeORM 0.3.20, pg 8.12.0, class-validator, class-transformer, @nestjs/swagger

### notification-service (Port 3007) — STATUS: ✅ Built
- **Storage:** None (Kafka consumer only)
- **Topics consumed:** `order.placed`, `order.status_changed`
- **Endpoints:** `GET /notifications/health`
- **Note:** Graceful fallback if Kafka offline; real email provider (SendGrid/SES) is a TODO stub

### Services NOT YET BUILT (Phase 3 backlog)
| Service | Port (planned) | Key responsibility |
|---------|---------------|-------------------|
| search-service | 3002 | Elasticsearch product search |
| feature-flag-service | 3008 | Unleash wrapper |
| i18n-service | 3009 | Locale + currency + tax rates |

### cart-service (Port 3003) — STATUS: ✅ Built
- **Storage:** Redis (ioredis) — 7-day TTL per cart
- **Endpoints:** POST /carts, GET /carts/:id, POST /carts/:id/items, PUT /carts/:id/items/:productId, DELETE /carts/:id/items/:productId, PATCH /carts/:id/coupon, GET /carts/:id/total, DELETE /carts/:id
- **Coupons:** SAVE10 (10%), SAVE20 (20%), WELCOME5 (5%) — hardcoded, replace with DB table

### order-service (Port 3004) — STATUS: ✅ Built
- **Storage:** PostgreSQL (TypeORM, synchronize=true)
- **Events:** Publishes `order.placed` and `order.status_changed` to Kafka (graceful fallback if Kafka offline)
- **Endpoints:** POST /orders, GET /orders, GET /orders/:id, PATCH /orders/:id/status, DELETE /orders/:id (cancel)
- **Idempotency:** Unique `idempotencyKey` column prevents duplicate orders

### payment-service (Port 3005) — STATUS: ✅ Built
- **Storage:** PostgreSQL (TypeORM)
- **Endpoints:** POST /payments/intent, POST /payments/:id/confirm, POST /payments/:id/refund, GET /payments/:id, GET /payments/order/:orderId
- **Gateways:** Stripe + Razorpay stubs ready (live keys needed); Sandbox mode auto-succeeds
- **Default:** sandboxMode=true in dev

### seller-service (Port 3006) — STATUS: ✅ Built
- **Storage:** PostgreSQL (TypeORM)
- **Endpoints:** POST /sellers/apply, GET /sellers, GET /sellers/:id, GET /sellers/:id/status, PATCH /sellers/:id/review, POST /sellers/:id/documents
- **Status flow:** pending → under_review → approved/rejected
- **KYC:** Document URLs stored as JSONB; kycVerified=true on approval

---

## 4. Infrastructure State

### Docker Compose (`docker-compose.yml`) — STATUS: ✅ Final version ready
| Container | Image | Host Port | Notes |
|-----------|-------|-----------|-------|
| ecom_postgres | postgres:15-alpine | **5433**:5432 | avoids Magento conflict |
| ecom_redis | redis:7-alpine | **6380**:6379 | avoids Magento conflict |
| ecom_kafka | apache/kafka:3.7.0 | **9093**:9092 | KRaft mode, NO zookeeper needed |
| ecom_elasticsearch | docker.elastic.co/elasticsearch/elasticsearch:**7.17.29** | **9201**:9200 | uses already-pulled local image |
| ecom_keycloak | keycloak:24.0.4 | **8082**:8080 | avoids port 8080/8081 conflicts |
| ecom_kong | kong:3.7-ubuntu | 8000, 8001 | DB-less, admin on 8001 |
| ecom_catalog | local build | 3000 | |
| ecom_product | local build | 3001 | depends_on postgres healthy |
| ecom_cart | local build | 3003 | depends_on redis healthy |
| ecom_order | local build | 3004 | depends_on postgres healthy |
| ecom_payment | local build | 3005 | depends_on postgres healthy |
| ecom_seller | local build | 3006 | depends_on postgres healthy |
| ecom_notification | local build | 3007 | Kafka consumer |

**Key fixes applied this session:**
- Replaced `bitnami/kafka` + `bitnami/zookeeper` (paywalled) with `apache/kafka:3.7.0` KRaft mode
- Switched ES from 8.10.0 (not pulled) to `7.17.29` (already on machine)
- All ports remapped to avoid Magento stack conflicts
- `.env` file created at root for all secrets/config
- `name: ecommerce` added to compose for clean container naming

**LAST BLOCKER:** Docker Desktop was in a bad state (read-only filesystem error after interrupted pulls). Fix: **Restart Docker Desktop** from system tray, then run:
```
docker compose up -d postgres redis kafka elasticsearch keycloak
```
Wait 30s for infra to be healthy, then:
```
docker compose up -d --build
```

### Kong Routes (`infra/kong/kong.yaml`) — STATUS: ✅ Updated
```
GET  /health              → catalog-service:3000
GET  /catalog             → catalog-service:3000
GET,POST,PUT,DELETE /products    → product-service:3001
GET,POST,PUT,DELETE /carts       → cart-service:3003
GET,POST,PUT,DELETE /orders      → order-service:3004
GET,POST,PUT,DELETE /payments    → payment-service:3005
GET,POST,PUT,DELETE /sellers     → seller-service:3006
```

### Keycloak
- Admin UI: http://localhost:8082 (remapped from 8080)
- Credentials: admin / admin
- OIDC clients: NOT yet configured

---

## 5. Technology Decisions (Locked)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend language | NestJS (TypeScript) | Modular, GraphQL + REST, microservices-ready |
| Frontend | Next.js (React) | SSR for SEO, ISR for product pages |
| API Gateway | Kong | Docker-native, declarative config, plugin ecosystem |
| Auth | Keycloak | Self-hosted OIDC, RBAC out of the box |
| Database | PostgreSQL 15 | ACID for financial data |
| Cache | Redis 7 | Session store + catalog caching |
| Search | Elasticsearch 8.10 | Faceted search, relevance tuning |
| Event bus | Kafka (Bitnami) | Decoupled async: orders, inventory, notifications |
| Feature flags | Unleash (self-hosted) | No SaaS cost, full control |
| Observability | Prometheus + Grafana + Loki | Open-source stack |
| IaC | Terraform | Cloud-agnostic |
| Cloud (prod) | TBD (AWS preferred) | EKS for K8s |
| Payment gateways | Stripe + Razorpay | Multi-region coverage |
| Containerisation | Docker Compose (dev) → K8s (prod) | |

---

## 6. Phased Roadmap & Current Status

### Phase 1 – Foundations (Weeks 1-2) — 🔄 ~90% Complete
- [x] Monorepo structure created
- [x] Docker Compose fully rewritten with healthchecks (Keycloak bug fixed)
- [x] catalog-service updated (Swagger, pinned deps)
- [x] product-service fully rewritten (TypeORM + PostgreSQL + Swagger + validation)
- [x] Kong routing updated (format 3.0, rate-limiting, CORS plugins)
- [x] Dockerfiles fixed (curl added, multi-stage)
- [x] GitHub Actions CI pipeline written (`.github/workflows/ci.yml`)
- [ ] **ACTION NEEDED: `npm install` both services after reboot** (was running at restart)
- [ ] **ACTION NEEDED: `npm run build` both services to verify TypeScript compiles**
- [ ] docker compose up verified end-to-end
- [ ] Health endpoints confirmed through Kong (http://localhost:8000/health)
- [ ] Keycloak OIDC clients configured
- [ ] product-service PostgreSQL connection verified (TypeORM synchronize=true auto-creates table)

### Phase 2 – Feature Flag Service (after Phase 1) — ⏳ Not started
- [ ] Unleash container added to docker-compose.yml
- [ ] Admin UI for flag management
- [ ] `features` table in PostgreSQL
- [ ] Kong middleware for flag-based header injection
- [ ] Audit logging

### Phase 3 – Core Marketplace Services — 🔄 ~60% Complete
- [x] product-service (PostgreSQL, TypeORM, Swagger)
- [x] cart-service (Redis, ioredis, coupons)
- [x] order-service (PostgreSQL, Kafka events, idempotency)
- [x] payment-service (Sandbox + Stripe/Razorpay stubs)
- [x] seller-service (KYC workflow, document upload, review flow)
- [x] All 5 services added to docker-compose.yml
- [x] All 5 services added to Kong routes
- [ ] search-service (Elasticsearch)
- [ ] notification-service (Kafka consumer)
- [ ] OpenAPI specs exported per service
- [ ] Kafka event wiring verified end-to-end
- [ ] OPA policies for RBAC/ABAC

### Phase 4 – Customer UI — ⏳ Not started
- [ ] Next.js PWA in `frontend/`
- [ ] Design system (component library)
- [ ] i18n, accessibility (WCAG AA), SEO
- [ ] Lighthouse CI budget: FCP < 1.5s, LCP < 2.5s

### Phase 5 – Production Ops — ⏳ Not started
- [ ] Kubernetes manifests / Helm charts
- [ ] Prometheus + Grafana + Loki + OpenTelemetry
- [ ] Terraform modules (VPC, RDS, EKS, IAM, S3)
- [ ] Canary deployments (Argo Rollouts)
- [ ] Backup/DR runbooks

---

## 7. Naming & Code Conventions

- **Service ports:** catalog=3000, product=3001, others increment from 3002
- **API prefix:** `/api/v1/` (not yet applied — current services use bare paths)
- **NestJS pattern:** Controller → Service → DTO → Module (no Repository layer yet)
- **DTO naming:** `CreateXxxDto`, `UpdateXxxDto`
- **Kafka topics naming:** `<entity>.<event>` e.g. `product.created`, `order.placed`
- **Health endpoint:** every service must expose `GET /health` → `{ status: 'OK' }`
- **package.json scripts:** `build`, `start:dev`, `test`, `lint` (standard across all services)
- **TypeScript:** strict mode, NestJS decorators, `reflect-metadata` required

---

## 8. Immediate Next Actions (Priority Order)

1. **Start Docker Desktop** and run `docker compose up --build -d` from `d:\ecommarce\`
2. **Test all Kong routes** once stack is up:
   - `curl http://localhost:8000/health`
   - `curl http://localhost:8000/products/health`
   - `curl http://localhost:8000/carts/health`
   - `curl http://localhost:8000/orders/health`
   - `curl http://localhost:8000/payments/health`
   - `curl http://localhost:8000/sellers/health`
3. **Scaffold search-service** (Port 3002, Elasticsearch)
4. **Scaffold notification-service** (Port 3007, Kafka consumer → log/email)
5. **Add Unleash to docker-compose** — begin Phase 2 feature flags

---

## 9. Key File Quick Reference

| What you need | Where it is |
|--------------|-------------|
| Full feature list | `discussion/consolidated_feature_set.md` |
| Implementation plan | `discussion/implementation_plan.md` |
| Architecture diagrams | `discussion/scalable_architecture.md` |
| Phased roadmap detail | `discussion/roadmap_detail.md` |
| Design system spec | `discussion/design_system.md` |
| User journeys | `discussion/user_journeys.md` |
| Seller journeys | `discussion/seller_journeys.md` |
| Admin journeys | `discussion/admin_journeys.md` |
| Work log | `project_history.md` |
| Docker stack | `docker-compose.yml` |
| Kong routes | `infra/kong/kong.yaml` |
| Product service code | `services/product-service/src/` |
| Catalog service code | `services/catalog-service/src/` |

---

## 10. Credit-Saving Rules for This Project

- **Always read this file first** — do not scan project structure unless something is missing here
- **Update this file** at the end of each session with new service statuses, resolved issues, and completed tasks
- **Update `project_history.md`** with a dated entry for every session
- **When adding a new service**, add it to Section 3 (Service Registry) and Section 6 (Roadmap)
- **When a blocker is resolved**, mark it done in Section 6 and remove from Section 8
- **Don't re-read discussion/ files** unless designing a new feature — summaries are captured here
