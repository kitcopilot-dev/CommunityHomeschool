import sys
import json
import urllib.request
import os

API_BASE = "https://api.agentmail.to/v0"
KEY_FILE = "memory/agentmail_key.txt"

def get_api_key():
    try:
        with open(KEY_FILE, 'r') as f:
            return f.read().strip()
    except:
        return os.environ.get("AGENTMAIL_KEY")

def api_call(endpoint, method="GET", data=None):
    key = get_api_key()
    url = f"{API_BASE}{endpoint}"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json"
    }
    
    req = urllib.request.Request(url, method=method, headers=headers)
    if data:
        json_data = json.dumps(data).encode('utf-8')
        req.data = json_data
        
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": str(e), "body": e.read().decode()}
    except Exception as e:
        return {"error": str(e)}

def list_inboxes():
    return api_call("/inboxes")

def send_email(inbox_id, to, subject, text):
    payload = {
        "to": to,
        "subject": subject,
        "text": text
    }
    return api_call(f"/inboxes/{inbox_id}/messages/send", method="POST", data=payload)

def list_threads(inbox_id):
    return api_call(f"/inboxes/{inbox_id}/threads")

def get_thread(inbox_id, thread_id):
    return api_call(f"/inboxes/{inbox_id}/threads/{thread_id}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 mail.py <cmd> [args]")
        sys.exit(1)
        
    cmd = sys.argv[1]
    
    if cmd == "list-inboxes":
        print(json.dumps(list_inboxes(), indent=2))
    elif cmd == "send":
        # python3 mail.py send <inbox_id> <to> <subject> <text>
        res = send_email(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
        print(json.dumps(res, indent=2))
    elif cmd == "list-threads":
        print(json.dumps(list_threads(sys.argv[2]), indent=2))
    elif cmd == "get-thread":
        print(json.dumps(get_thread(sys.argv[2], sys.argv[3]), indent=2))
