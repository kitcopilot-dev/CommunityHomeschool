import json
import os
import subprocess
from datetime import datetime

PRICING_FILE = "memory/pricing.json"
STATS_FILE = "memory/usage_stats.json"

def get_sessions():
    result = subprocess.run(["openclaw", "sessions", "list", "--limit", "100", "--json"], capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
        return data.get("sessions", [])
    except:
        return []

def load_json(path):
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return {}

def save_json(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)

def main():
    pricing = load_json(PRICING_FILE)
    old_stats = load_json(STATS_FILE)
    current_sessions = get_sessions()
    
    report_data = []
    total_cost = 0.0
    
    new_stats = {
        "timestamp": datetime.now().isoformat(),
        "sessions": {}
    }

    for s in current_sessions:
        model = s.get("model", "unknown")
        tokens = s.get("totalTokens", 0)
        # Simplified: OpenClaw doesn't always split in/out in the list
        # We'll treat totalTokens as 80% input, 20% output for estimate
        input_tokens = tokens * 0.8
        output_tokens = tokens * 0.2
        
        rates = pricing.get(model, {"input": 0, "output": 0})
        cost = (input_tokens / 1000000 * rates["input"]) + (output_tokens / 1000000 * rates["output"])
        
        # Calculate delta if we have old data
        old_tokens = old_stats.get("sessions", {}).get(s["key"], 0)
        delta_tokens = max(0, tokens - old_tokens)
        delta_cost = (delta_tokens * 0.8 / 1000000 * rates["input"]) + (delta_tokens * 0.2 / 1000000 * rates["output"])
        
        if delta_tokens > 0:
            report_data.append({
                "model": model,
                "tokens": delta_tokens,
                "cost": delta_cost
            })
            total_cost += delta_cost
            
        new_stats["sessions"][s["key"]] = tokens

    if not report_data:
        print("No usage recorded since last report.")
        return

    # Format report
    report = "📊 **Daily Usage Report**\n\n"
    for item in report_data:
        report += f"- **{item['model']}**: {item['tokens']:,} tokens (~${item['cost']:.4f})\n"
    
    report += f"\n💰 **Total Daily Spend: ${total_cost:.4f}**"
    
    # Save for next time
    save_json(STATS_FILE, new_stats)
    
    # Send report (using openclaw message tool via cli)
    # We target Justin's Telegram ID 1197989366
    subprocess.run([
        "openclaw", "message", "send", 
        "--channel", "telegram",
        "--target", "1197989366", 
        "--message", report
    ])

if __name__ == "__main__":
    main()
