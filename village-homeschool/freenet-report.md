# Research Report: Use Cases for Freenet (The New Freenet / Locutus)

## Executive Summary
The modern Freenet project (formerly known as Locutus) is not just a censorship-resistant file store like the original Freenet. It is a decentralized platform designed for **cryptographically secure, scalable, and verifiable state management**. It uses WebAssembly (WASM) "contracts" to define how data is updated and merged across a global peer-to-peer network without any central servers.

## Key Technical Advantages
*   **Zero Infrastructure**: No databases to maintain or pay for. The network itself stores and replicates the data.
*   **Scalability**: Designed to handle millions of users through a routing algorithm that works similarly to the "Small World" phenomenon.
*   **Verifiable Data**: Every update is signed and verified by WASM contracts, ensuring that no one can "cheat" or inject invalid data.
*   **Offline-First**: Can operate over local networks or intermittently connected nodes.

---

## Suggested App Use Cases

### 1. The "Village Registry" (Verifiable Academic Credentials)
**Concept**: A decentralized alternative to a school registrar.
*   **How it works**: Parents sign "completion certificates" for their children using their private keys. These are stored on Freenet as verifiable contracts.
*   **Value**: When a student applies to college or for a job, they provide a link to their Freenet state. The third party can cryptographically verify that the records are authentic and haven't been tampered with, even decades after the "Village" app might have stopped existing.

### 2. Peer-to-Peer "Open Curriculum" Marketplace
**Concept**: A marketplace for lesson plans without a middleman (like TeachersPayTeachers).
*   **How it works**: Lessons are stored as decentralized objects on Freenet. Payments can be handled via cryptocurrency or simple reputation-based exchange.
*   **Value**: Creators keep 100% of the value. There is no central authority that can take down a lesson plan because of political or corporate policy changes. It becomes a permanent, global library of human knowledge.

### 3. "The Ghost Kitchen" (Decentralized Local Supply Chain)
**Concept**: An app for coordinating local food clusters or "farm-to-table" micro-networks.
*   **How it works**: Inventory (eggs, milk, produce) is tracked on a Freenet contract shared by a local neighborhood. 
*   **Value**: Communities can coordinate essential supplies during emergencies or when standard internet infrastructure is failing. It doesn't rely on AWS or Google Cloud to function—just local peers.

### 4. Collaborative "Living" Encyclopedia
**Concept**: A real-time wiki that scales to millions of editors without a central host.
*   **How it works**: Uses Freenet's "Commutative Monoids" to merge edits from different users instantly and consistently.
*   **Value**: It provides the collaborative power of Wikipedia with the absolute censorship resistance of a decentralized network.

---

## Strategic Recommendation
If we were to integrate Freenet into **Village**, the best starting point would be **Case #1 (Verifiable Credentials)**. It adds a "Pro" layer to our transcripts, making them tamper-proof and permanently accessible regardless of what happens to the Village servers.
