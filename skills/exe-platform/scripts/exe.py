#!/usr/bin/env python3
import subprocess
import sys
import json

def run_exe_cmd(cmd_list):
    full_cmd = ["ssh", "-o", "BatchMode=yes", "exe.dev"] + cmd_list
    try:
        result = subprocess.run(full_cmd, capture_output=True, text=True, check=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return f"Error: {e.stderr.strip()}"

def main():
    if len(sys.argv) < 2:
        print("Usage: exe.py <command> [args...]")
        sys.exit(1)

    cmd = sys.argv[1:]
    output = run_exe_cmd(cmd)
    print(output)

if __name__ == "__main__":
    main()
