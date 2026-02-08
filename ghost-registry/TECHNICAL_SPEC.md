# Technical Specification: Ghost Registry (Ghosty)

**Version:** 1.0.0  
**Status:** Draft  
**Project:** Ghosty (Decentralized Software Registry)  
**Technology:** Freenet (Locutus), Rust, WebAssembly

---

## 1. Introduction
Ghosty is a decentralized software registry built on the Freenet protocol. It provides an unstoppable, cryptographically verifiable alternative to centralized registries like NPM. The core logic is implemented as Freenet WASM contracts, which govern how package versions are updated and how ownership is verified.

---

## 2. Architecture Diagram (Description)
1.  **Global Freenet Network**: Stores the contract code and the current state (version pointers and hashes) of all packages.
2.  **Ghosty WASM Contract**: Runs on Freenet nodes. Handles requests to `publish` or `update` packages. Validates cryptographic signatures.
3.  **Ghosty Local Daemon**: A background process running on the developer's machine.
    *   Acts as an HTTP Proxy for local package managers (NPM, Cargo).
    *   Talks to the Freenet node via WebSocket.
    *   Handles local signing of package tarballs.
4.  **Content Store**: Distributed storage (DHT) for the actual package binaries/tarballs, referenced by their CID (Content ID).

---

## 3. Data Models / Schemas

### 3.1. Registry State (Freenet State)
Stored as CBOR-encoded data on the Freenet network:
```rust
struct RegistryState {
    packages: HashMap<String, PackageEntry>,
}

struct PackageEntry {
    owner_pubkey: Vec<u8>,
    versions: HashMap<String, String>, // Version (e.g. "1.0.0") -> CID (hash of tarball)
    latest_version: String,
    metadata: PackageMetadata,
}

struct PackageMetadata {
    description: String,
    license: String,
    repository: String,
}
```

### 3.2. Update Request (Contract Input)
```rust
struct UpdateRequest {
    package_name: String,
    new_version: String,
    tarball_cid: String,
    signature: Vec<u8>, // Signature of (package_name + new_version + tarball_cid)
}
```

---

## 4. API / Interface Design

### 4.1. Local Proxy API (localhost:8080)
*   `GET /:package_name`: Resolves the package name to its latest version CID on Freenet and fetches the tarball.
*   `GET /:package_name/:version`: Fetches a specific version.
*   `PUT /:package_name`: Handles publishing a new package or version. Triggered by `npm publish`.

### 4.2. Freenet Contract Interface
*   `fn validate_update(state: &RegistryState, input: &UpdateRequest) -> bool`:
    *   Verifies `input.signature` against `state.packages[input.package_name].owner_pubkey`.
    *   Ensures `input.new_version` is higher than `state.latest_version` (SemVer logic).

---

## 5. Logic & Algorithms

### 5.1. Version Merging (Monoid Pattern)
Freenet uses monoids to merge state updates from different nodes.
*   **Merge Logic**: If two versions of a package are published simultaneously, the contract resolves the conflict by prioritizing the higher SemVer string. If they are the same version but different CIDs, the one with the earlier signed timestamp (if verifiable) or the lower hash wins.

### 5.2. Package Resolution
1.  User runs `npm install my-package`.
2.  NPM requests `http://localhost:8080/my-package`.
3.  Ghosty Daemon queries Freenet for the contract state of `my-package`.
4.  Ghosty Daemon retrieves the `tarball_cid` for the latest version.
5.  Ghosty Daemon fetches the binary data from Freenet DHT.
6.  Ghosty Daemon streams the tarball back to NPM.

---

## 6. Security Considerations
*   **Identity**: Authorship is tied to a public/private key pair. If a private key is lost, the package cannot be updated (Permanent state). Future iterations may include multisig or "key recovery" contracts.
*   **Binary Safety**: CIDs ensure that the downloaded binary exactly matches the one published. Freenet's routing prevents "man-in-the-middle" attacks on the registry itself.

---

## 7. Performance & Scalability
*   **Small World Routing**: Freenet's routing ensures that popular packages are cached and mirrored on nodes "closer" to the requesters, providing CDN-like performance without the cost.
*   **WASM Efficiency**: Contracts are extremely lightweight and execute in near-native speed on any node.

---

## 8. Deployment & Environment
*   **Prerequisites**: A running Freenet node (Locutus daemon).
*   **Language**: Rust (edition 2021), `wasm32-unknown-unknown` target.
*   **Tools**: `freenet-cli` for publishing contracts.
