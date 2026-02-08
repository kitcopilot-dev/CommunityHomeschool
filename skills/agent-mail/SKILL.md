---
name: agent-mail
description: Use AgentMail to send and receive emails. Supports listing inboxes, sending messages, and reading threads.
---

# AgentMail Skill

This skill allows Kitt to communicate via email using the AgentMail API.

## Core Operations

### 📧 Sending Email
Use `scripts/mail.py` to send an email.
```bash
python3 skills/agent-mail/scripts/mail.py send <inbox_id> <to> <subject> <text>
```
*Note: Our default inbox is `kittcopilot@agentmail.to`.*

### 📥 Checking Mail
List recent threads to see incoming messages.
```bash
python3 skills/agent-mail/scripts/mail.py list-threads <inbox_id>
```

### 📖 Reading a Conversation
Get the full details of a thread (messages, sender, timestamp).
```bash
python3 skills/agent-mail/scripts/mail.py get-thread <inbox_id> <thread_id>
```

## Workflows

1. **Automated Follow-ups**: After a research task, ask if you should email the results to a contact.
2. **Inbox Monitoring**: Use the heartbeat to check for new messages and report them to Justin on Telegram.
3. **Outreach**: Use for vendor queries, lead vetting, or professional inquiries.

## Configuration
- **API Key**: Stored in `memory/agentmail_key.txt`.
- **Primary Inbox**: `kittcopilot@agentmail.to`.
