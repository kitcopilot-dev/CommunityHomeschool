# Product Requirements Document (PRD): Ghost Registry (Ghosty)

**Version:** 1.0.0  
**Status:** Draft  
**Owner:** Kitt Copilot (on behalf of Justin)  
**Date:** Feb 8, 2026

---

## 1. Vision & Mission
**Ghost Registry** is a decentralized, unstoppable software registry designed to eliminate platform risk in the global software supply chain. It leverages the Freenet (Locutus) protocol to ensure that once a piece of code is published, it remains available and verifiable forever, regardless of corporate or political interventions.

**Mission:** To provide a foundation of permanence for the tools that build the internet.

---

## 2. Problem Statement
*   **Platform Centralization**: NPM, PyPI, and Cargo are owned by single entities. They have the power to delete packages, block access by region, or suffer from massive outages.
*   **Supply Chain Fragility**: The "left-pad" incident proved that the sudden disappearance of a single small dependency can break millions of build systems globally.
*   **Planned Obsolescence**: When a company pivots or shuts down, the repositories and registries developers rely on often disappear, rendering old projects unbuildable.

---

## 3. Target Audience
*   **Open Source Maintainers**: Seeking permanent homes for their work.
*   **DevOps/Enterprise**: Organizations requiring absolute uptime and protection against registry-level outages.
*   **Privacy/Freedom Advocates**: Developers working in restricted regions who need censorship-resistant access to tools.

---

## 4. Core Features (Phase 1)

### 4.1. Immutable Hosting (The "Ghost" Store)
*   Packages (tarballs, binaries, sources) are stored on the Freenet P2P network.
*   Content is addressable by hash (CID), ensuring the code you request is exactly what you get.

### 4.2. Cryptographic Authorship
*   Developers sign their package updates with private keys.
*   The Ghost Registry contract verifies the signature before updating the "latest" pointer for a package.

### 4.3. Decentralized Versioning
*   Uses Freenet's state management to track versions (SemVer).
*   State is merged across the network, ensuring a consistent global view of available versions.

### 4.4. Proxy Compatibility Layer
*   A local CLI tool that acts as a proxy for standard package managers.
*   Example: `npm config set registry http://localhost:8080` (where Ghosty is listening).
*   Ghosty fetches from Freenet first, then falls back to public registries if needed.

---

## 5. Technical Architecture
*   **Protocol**: Freenet (Locutus).
*   **State Logic**: WASM Contracts (defining how version increments and ownership transfers work).
*   **Client**: A lightweight Rust or TypeScript CLI daemon.
*   **Storage**: P2P distributed hash table (DHT) with small-world routing.

---

## 6. Success Metrics
1.  **Availability**: 100% uptime for packages once published.
2.  **Verification**: 0% chance of package tampering detected by the protocol.
3.  **Adoption**: Successful mirroring of Top 100 most-depended-on NPM packages.

---

## 7. Refinement & Open Questions
*   **Incentivization**: How do we encourage nodes to store large binaries (like Node.js versions)?
*   **Naming Collision**: How do we handle name squatting without a central moderator? (Likely reputation-based or first-come-first-serve via signed timestamps).
*   **Discovery**: How do users search for packages without a central index? (Likely a decentralized search index contract).
