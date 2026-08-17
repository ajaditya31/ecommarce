# Seller Journeys – Major E‑commerce Platforms

This document outlines the **seller‑side end‑to‑end flow** for the leading e‑commerce platforms (Amazon, eBay, Walmart, Alibaba, Shopify, Magento, WooCommerce, BigCommerce, Saleor). Each flow follows the seller from account creation to final payment settlement and account closure.

---

## 1️⃣ Amazon Marketplace (Seller Central)

```mermaid
flowchart TD
    A[Home – Amazon Seller Central] --> B[Register – Provide Business Info]
    B --> C[Identity Verification (Docs, Phone OTP)]
    C --> D[Account Approval]
    D --> E[Login]
    E --> F[Dashboard Overview]
    F --> G[Add Product – SKU, Images, Pricing]
    G --> H[Inventory & Fulfillment Settings]
    H --> I[Publish Listing]
    I --> J[Order Notification]
    J --> K[Confirm / Pack Order]
    K --> L[Ship via Amazon (FBA) or Own Logistics]
    L --> M[Delivery Confirmation]
    M --> N[Payment Settlement – 14‑day cycle]
    N --> O[Financial Reports & Payouts]
    O --> P[Return / Refund Handling]
    P --> Q[Dispute Management]
    Q --> R[Account Health Monitoring]
    R --> S[Account Closure (optional)]
``` 

---

## 2️⃣ eBay Seller Hub

```mermaid
flowchart TD
    A[Seller Hub Home] --> B[Sign‑Up – Email & Password]
    B --> C[Business Verification]
    C --> D[Approve Account]
    D --> E[Login]
    E --> F[Create Listing – Title, Media, Pricing]
    F --> G[Set Shipping & Payment Options]
    G --> H[Publish]
    H --> I[Order Received]
    I --> J[Process Payment via Managed Payments]
    J --> K[Print Shipping Label]
    K --> L[Ship Order]
    L --> M[Delivery Confirmation]
    M --> N[Funds Disbursed – 2‑day hold then weekly]
    N --> O[View Payout Report]
    O --> P[Handle Returns]
    P --> Q[Resolve Disputes]
    Q --> R[Seller Performance Dashboard]
    R --> S[Close Store (optional)]
``` 

---

## 3️⃣ Walmart Marketplace

```mermaid
flowchart TD
    A[Walmart Seller Portal] --> B[Register – Business & Tax Info]
    B --> C[Verification & Approval]
    C --> D[Login]
    D --> E[Onboarding – Upload Catalog via API/Feed]
    E --> F[Set Pricing & Inventory]
    F --> G[Go‑Live Listing]
    G --> H[Order Notification]
    H --> I[Confirm & Ship]
    I --> J[Carrier Integration (ShipEngine, UPS, etc.)]
    J --> K[Delivery Confirmation]
    K --> L[Payment Settlement – Net‑15]
    L --> M[Financial Dashboard]
    M --> N[Process Returns]
    N --> O[Dispute Resolution]
    O --> P[Health Metrics]
    P --> Q[Account Termination]
``` 

---

## 4️⃣ Alibaba (1688) – International Sellers

```mermaid
flowchart TD
    A[Alibaba Seller Center] --> B[Sign‑Up – Phone & Business Docs]
    B --> C[Identity & Bank Verification]
    C --> D[Account Activation]
    D --> E[Login]
    E --> F[Create Product – Bulk Upload]
    F --> G[Set Trade Terms & Logistics]
    G --> H[Publish]
    H --> I[Order Placement by Buyer]
    I --> J[Confirm Order & Issue Invoice]
    J --> K[Arrange Shipping (Freight/Express)]
    K --> L[Track Shipment]
    L --> M[Delivery Confirmation]
    M --> N[Payment Release – Escrow until receipt]
    N --> O[Settlement to Seller Bank]
    O --> P[After‑sale Service & Returns]
    P --> Q[Dispute Arbitration]
    Q --> R[Performance Score]
    R --> S[Account Deactivation]
``` 

---

## 5️⃣ Shopify (Shopify Plus for Marketplace)

```mermaid
flowchart TD
    A[Shopify Partner Dashboard] --> B[Apply for Shopify Marketplace App]
    B --> C[Approval & API Keys]
    C --> D[Seller Sign‑Up – Email & Password]
    D --> E[Two‑Factor Auth]
    E --> F[Onboarding – Install Marketplace App]
    F --> G[Create Products via Admin UI / API]
    G --> H[Configure Payments (Shopify Payments / Stripe)]
    H --> I[Publish Store]
    I --> J[Customer Purchases]
    J --> K[Order Notification in Shopify]
    K --> L[Process Fulfillment (Shopify Fulfilment Network or 3rd‑party)]
    L --> M[Ship & Provide Tracking]
    M --> N[Delivery Confirmation]
    N --> O[Funds Payout – 3‑day rolling]
    O --> P[Sales & Payout Reports]
    P --> Q[Handle Refunds & Returns]
    Q --> R[Dispute Management]
    R --> S[Seller Dashboard Metrics]
    S --> T[Close Store / App Uninstall]
``` 

---

## 6️⃣ Magento (Open‑Source & Adobe Commerce)

```mermaid
flowchart TD
    A[Magento Marketplace] --> B[Register – Business Details]
    B --> C[Email Verification]
    C --> D[Login]
    D --> E[Install Marketplace Extension]
    E --> F[Configure Seller Account]
    F --> G[Add Products – CSV / UI]
    G --> H[Set Shipping & Tax Rules]
    H --> I[Publish Catalog]
    I --> J[Order Received]
    J --> K[Process Payment via Integrated Gateway]
    K --> L[Prepare Shipment]
    L --> M[Create Shipment & Tracking Number]
    M --> N[Notify Buyer]
    N --> O[Payment Capture & Settlement (Typically 2‑day hold then weekly)]
    O --> P[Financial Reporting]
    P --> Q[Return & Refund Workflow]
    Q --> R[Dispute Resolution]
    R --> S[Seller Performance Dashboard]
    S --> T[Account Closure]
``` 

---

## 7️⃣ WooCommerce (WordPress)

```mermaid
flowchart TD
    A[WordPress Site] --> B[Install WooCommerce Plugin]
    B --> C[Create Vendor Account (via Marketplace Extension)]
    C --> D[Seller Registration – Name, Email, Bank]
    D --> E[Verification (Email + Admin Approval)]
    E --> F[Login to Vendor Dashboard]
    F --> G[Add Products – Images, SKU, Price]
    G --> H[Set Shipping Zones]
    H --> I[Publish Products]
    I --> J[Order Notification]
    J --> K[Process Payment (Stripe/PayPal)
    K --> L[Package & Ship]
    L --> M[Update Order Status & Tracking]
    M --> N[Funds Transfer – Weekly Payouts]
    N --> O[Sales Reports]
    O --> P[Handle Returns]
    P --> Q[Refund Processing]
    Q --> R[Dispute Management]
    R --> S[Vendor Dashboard Metrics]
    S --> T[Deactivate Vendor Account]
``` 

---

## 8️⃣ BigCommerce (B2B Marketplace Extension)

```mermaid
flowchart TD
    A[BigCommerce Partner Portal] --> B[Apply for Marketplace Extension]
    B --> C[Approval & API Credentials]
    C --> D[Seller Sign‑Up – Email, Business Info]
    D --> E[Two‑Factor Authentication]
    E --> F[Dashboard Access]
    F --> G[Add Products via Bulk Import]
    G --> H[Configure Shipping & Tax]
    H --> I[Publish Listings]
    I --> J[Order Received]
    J --> K[Process Payment via Integrated Gateway]
    K --> L[Ship Order (Third‑Party Logistics Integration)]
    L --> M[Delivery Confirmation]
    M --> N[Settlement – Net‑30 payout]
    N --> O[Financial Summary]
    O --> P[Returns & Refunds]
    P --> Q[Dispute Handling]
    Q --> R[Seller Performance Dashboard]
    R --> S[Account Termination]
``` 

---

## 9️⃣ Saleor (Headless, GraphQL)

```mermaid
flowchart TD
    A[Saleor Dashboard] --> B[Create Seller Account – OAuth / Email]
    B --> C[Verify Business Details]
    C --> D[Activate Account]
    D --> E[Login to Seller Workspace]
    E --> F[Add Products via GraphQL Mutations]
    F --> G[Set Up Shipping Methods (Carrier API)]
    G --> H[Publish Catalog]
    H --> I[Order Created (Checkout API)]
    I --> J[Authorize Payment (Stripe/Adyen)
    J --> K[Capture Funds]
    K --> L[Prepare Shipment]
    L --> M[Update Order Status & Tracking]
    M --> N[Funds Settlement – 7‑day rolling]
    N --> O[Analytics Dashboard]
    O --> P[Return & Refund Flow]
    P --> Q[Dispute Management]
    Q --> R[Seller Health Metrics]
    R --> S[Close Account]
``` 

---

### How to Use This Document
- **Compare** each platform’s steps with the features we defined in `consolidated_feature_set.md`.
- **Identify gaps** in our planned micro‑service architecture (e.g., missing verification service, payout scheduling, or return workflow).
- **Prioritise** the seller‑centric capabilities that deliver the highest ROI for a multi‑vendor marketplace.
- **Map** each high‑level step to a dedicated service/component (Auth, Onboarding, Catalog, Order, Payment, Settlement, Returns, Dispute, Analytics).

Feel free to request additional detail for any specific platform or to start translating these flows into API contracts and UI wireframes.
