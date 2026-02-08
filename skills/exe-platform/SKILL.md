---
name: exe-platform
description: Manage your exe.dev VM fleet and infrastructure.
---

# exe-platform Skill

This skill allows Kitt to control the underlying exe.dev infrastructure via the platform CLI.

## Core Operations

### 🖥️ VM Management
- **List VMs**: `python3 skills/exe-platform/scripts/exe.py ls`
- **Create VM**: `python3 skills/exe-platform/scripts/exe.py new <name>`
- **Delete VM**: `python3 skills/exe-platform/scripts/exe.py rm <name>`
- **Restart VM**: `python3 skills/exe-platform/scripts/exe.py restart <name>`
- **Clone VM**: `python3 skills/exe-platform/scripts/exe.py cp <source> <target>`

### 🌐 Networking & Sharing
- **Map Port**: `python3 skills/exe-platform/scripts/exe.py share port <name> <port>`
- **Make Public**: `python3 skills/exe-platform/scripts/exe.py share set-public <name>`
- **Make Private**: `python3 skills/exe-platform/scripts/exe.py share set-private <name>`
- **Show Shares**: `python3 skills/exe-platform/scripts/exe.py share show <name>`
- **Manage Links**: `python3 skills/exe-platform/scripts/exe.py share add-link <name>`

### 📧 Email Integration
- **Enable Inbound**: `python3 skills/exe-platform/scripts/exe.py share receive-email <name> on`
- **Disable Inbound**: `python3 skills/exe-platform/scripts/exe.py share receive-email <name> off`

## Capabilities
- **Orchestration**: Kitt can spawn worker nodes for heavy tasks.
- **Sandboxing**: Kitt can run untrusted code in a separate, temporary VM.
- **Instant Deployment**: Kitt can expose internal tools/dashboards to the web.
