# Feature Review – Open‑Source E‑Commerce CMS / Frameworks

Below is a **feature‑by‑feature** comparison of the leading open‑source platforms, evaluated against the **core features** we identified for our marketplace (checkout, catalog, multi‑vendor, headless APIs, marketing, feature‑flags, analytics, i18n, scalability). The goal is to pinpoint which framework already provides the most out‑of‑the‑box capabilities so we can minimise custom development.

---

## 1️⃣ Saleor (Python / Django)
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | Built‑in **checkout flow** with payment gateways (Stripe, Braintree) and **PCI‑DSS** readiness (via external services). | Secure, extensible checkout; sandbox mode via test keys. |
| **Product Catalog** | Rich product model (variants, digital products), **CSV import**, **media handling** via Django admin. | Immediate catalog management, easy bulk updates. |
| **Multi‑Vendor** | Community **saleor‑multivendor** extension (still experimental). | Allows seller onboarding, commission splits – requires some custom work. |
| **Headless API** | **GraphQL API** (full coverage), **REST** fallback. | Perfect for custom front‑ends (React, Next.js, mobile). |
| **Marketing / Promotions** | **Discounts** (fixed, percentage, vouchers), **Campaigns** via plugins. | Basic promotion engine, can extend for loyalty. |
| **Feature Flags** | No native system; recommend **Unleash** or **LaunchDarkly** integration. | Add external flag service. |
| **Analytics** | **Dashboard** with sales, orders; integration points for **Google Analytics**. | Baseline seller metrics; deeper analytics need external BI. |
| **Internationalisation** | **Django i18n**, multi‑currency via **django‑money** and plugins. |
| **Scalability** | Deployable on **Kubernetes**, **Docker**, supports **Celery** workers for async tasks. |

---

## 2️⃣ Medusa (Node / TypeScript)
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | **Medusa Checkout** with Stripe, PayPal, manual payments; **Webhooks** for order events. | Flexible, easy to add new providers. |
| **Product Catalog** | **Products, variants, collections**, **CSV import** CLI, media via S3. |
| **Multi‑Vendor** | No built‑in marketplace; community **medusa‑multitenancy** plugin (experimental). |
| **Headless API** | **REST** + **GraphQL** via `medusa-js`. |
| **Marketing / Promotions** | **Discounts** (percentage, fixed, free shipping) and **Gift Cards**. |
| **Feature Flags** | Not native – can integrate **Unleash** via custom middleware. |
| **Analytics** | Basic admin UI metrics; can push events to **Segment**, **Mixpanel**. |
| **Internationalisation** | Locale support via **i18next** in front‑end; backend stores currency per order. |
| **Scalability** | Designed for **Docker/K8s**, uses **Redis** for job queues, scalable workers. |

---

## 3️⃣ Reaction Commerce (Node / Meteor) – currently **archived** but still usable
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | **Checkout UI** with Stripe, PayPal; **Server‑side order processing**. |
| **Product Catalog** | **Products, variants**, **CSV bulk import**, media via GridFS. |
| **Multi‑Vendor** | **Marketplace** package (multi‑shop) – supports separate seller stores. |
| **Headless API** | **GraphQL** API via `reaction-graphql`. |
| **Marketing** | Basic **discounts**, **promo codes**. |
| **Feature Flags** | No built‑in; can use **LaunchDarkly** SDK. |
| **Analytics** | Minimal; external integration needed. |
| **I18n** | **i18n** package for multiple languages. |
| **Scalability** | Meteor scaling via **Kubernetes** and **Redis Oplog**; moderate complexity. |

---

## 4️⃣ Sylius (PHP / Symfony)
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | **Checkout Wizard** with **Payum** integration (Stripe, PayPal, Braintree). |
| **Product Catalog** | **Products, variants**, **media**, **CSV import** via plugins. |
| **Multi‑Vendor** | **Sylius Marketplace** plugin (commercial) or open‑source **Multi‑Vendor** community bundle. |
| **Headless API** | **API Platform** (REST/GraphQL) out‑of‑the‑box. |
| **Marketing** | **Discounts**, **Coupons**, **Promotion rules** engine. |
| **Feature Flags** | No native; can use **PHP‑Feature‑Flags** library or external service. |
| **Analytics** | Basic admin dashboards; extend via **Kibana** or **Google Data Studio**. |
| **I18n** | Symfony translation component, **multi‑currency** via MoneyBundle. |
| **Scalability** | Deployable via **Docker**, **K8s**, built‑in **Messenger** for async jobs. |

---

## 5️⃣ Vendure (Node / TypeScript)
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | **Checkout workflow** with plugin system; supports Stripe, Mollie, manual payments. |
| **Product Catalog** | **Products, variants**, **assets**, **CSV import** plugin. |
| **Multi‑Vendor** | Community **vendure‑plugin‑marketplace** (still early). |
| **Headless API** | **GraphQL** (first‑class), optional **REST** via plugin. |
| **Marketing** | **Discounts**, **Promotions**, **Gift Card** plugin. |
| **Feature Flags** | No native; can integrate **Unleash** via custom middleware. |
| **Analytics** | Basic sales reports; extend with **Elastic APM** or external BI. |
| **I18n** | Built‑in **Locale** support, **currency per channel**. |
| **Scalability** | Designed for **Docker/K8s**, uses **Redis** for job queue, **TypeORM** for DB abstraction. |

---

## 6️⃣ Shopware (PHP / Symfony)
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | **Checkout** with **PayPal**, **Stripe**, **Klarna**, **Adyen** integrations. |
| **Product Catalog** | Advanced product types, media, bulk import via **CSV/Excel**. |
| **Multi‑Vendor** | **Shopware Marketplace** (commercial) – community version has limited multi‑shop but can be extended. |
| **Headless API** | **Shopware Storefront API** (REST) and **GraphQL** beta. |
| **Marketing** | **Rule Builder** for promotions, **Shopping Experiences** for CMS pages. |
| **Feature Flags** | No built‑in; can use **FeatureToggleBundle** (PHP). |
| **Analytics** | **Administration** UI includes sales dashboards, can plug into **Google Analytics**. |
| **I18n** | Multi‑language, multi‑currency out‑of‑the‑box. |
| **Scalability** | Deployable via **Docker**, **K8s**, supports **Message Queues** (RabbitMQ). |

---

## 7️⃣ Spree (Ruby on Rails)
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | **Spree Checkout** with **Solidus** extensions, supports Stripe, Braintree. |
| **Product Catalog** | **Products, variants**, **CSV import** via extensions. |
| **Multi‑Vendor** | **Spree Marketplace** (commercial) or community **spree_multi_vendor** gem. |
| **Headless API** | **Spree API** (REST) and **GraphQL** via `spree_graphql` gem. |
| **Marketing** | **Promotions**, **Coupons**, **Discount codes** extensions. |
| **Feature Flags** | No native; can use **Flipper** gem. |
| **Analytics** | Basic admin dashboard; external analytics via **Segment**. |
| **I18n** | Rails i18n, multi‑currency via **money-rails**. |
| **Scalability** | Dockerizable, **Sidekiq** for background jobs, works on Kubernetes. |

---

## 8️⃣ Broadleaf Commerce (Java / Spring)
| Core Feature | Implementation | What It Gives Us |
|--------------|----------------|-------------------|
| **Checkout** | **Checkout** flow with **Spring Payments**, PCI‑DSS ready via external gateways. |
| **Product Catalog** | **Products, variants**, **media**, **CSV import** via admin UI. |
| **Multi‑Vendor** | **Marketplace** module (commercial) – supports seller onboarding. |
| **Headless API** | **REST** and **GraphQL** via Spring controllers. |
| **Marketing** | **Promotions**, **Discounts**, **Loyalty** modules (commercial). |
| **Feature Flags** | Can use **FF4J** or **LaunchDarkly** SDK. |
| **Analytics** | **Admin dashboard**, can integrate with **Elastic** or **Kibana**. |
| **I18n** | Spring i18n, multi‑currency via **Joda‑Money**. |
| **Scalability** | Cloud‑native, Docker, Kubernetes, **Spring Cloud** for microservices. |

---

## 📋 Summary & Recommendation
From the matrix above, the **top three candidates** that already provide the most of our core requirements out‑of‑the‑box are:
1. **Saleor** – excellent GraphQL API, solid checkout, good admin UI, Python ecosystem (fast development). Multi‑vendor needs a plugin but is actively being worked on.
2. **Vendure** – TypeScript/Node stack, first‑class GraphQL, flexible plugin system, already supports multi‑currency and localisation; marketplace plugin is maturing.
3. **Sylius** – PHP/Symfony with robust checkout via Payum, API Platform for headless, strong extensibility, and a commercial marketplace plugin if needed.

If we prioritise **JavaScript/TypeScript** for full‑stack consistency (React front‑end, Node back‑end), **Vendure** is the most aligned. For a **Python**‑centric team, **Saleor** offers rapid development and a mature admin UI. **Sylius** is a solid choice for a **PHP**‑based stack.

The next step is to pick one framework, spin up a minimal Docker development environment (Dockerfile + docker‑compose), and validate the core flows (checkout, product import, vendor onboarding). Once the foundation is verified, we can layer on the feature‑flag service (e.g., Unleash) and analytics dashboards.

---

*All this analysis is stored in* `D:\ecommarce\discussion\open_source_cms_review.md` *for future reference.*
