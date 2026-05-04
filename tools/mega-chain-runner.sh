#!/bin/bash
# mega-chain-runner.sh
# Runner template cho test batch trên HTPLDN — giảm 185 phút → 30 phút cho 47 TC
# Usage: ./mega-chain-runner.sh <chain-json-file> [--no-cleanup]
# Docs: CLAUDE.md Rule 11, memory/qa_htpldn_selectors_library.md
# Verified: 2026-04-21

set -eu

CHAIN_FILE="${1:-}"
NO_CLEANUP="${2:-}"
B=~/.claude/skills/gstack/browse/dist/browse

if [ -z "$CHAIN_FILE" ] || [ ! -f "$CHAIN_FILE" ]; then
  echo "Usage: $0 <chain-json-file> [--no-cleanup]"
  echo ""
  echo "Runs a mega-chain with preventive cleanup to avoid browse server degrade."
  echo "Pass --no-cleanup to skip cleanup (use when chaining multiple batches in same session)."
  exit 1
fi

if [ "$NO_CLEANUP" != "--no-cleanup" ]; then
  echo "== Preventive cleanup (chromium zombies) =="
  for pid in $(ps -ax | grep -E "chromium|playwright|chrome-headless-shell|browse-server" | grep -v grep | awk '{print $1}'); do
    kill -9 $pid 2>/dev/null || true
  done
  echo "Waiting 25s for processes to fully exit..."
  sleep 25
fi

echo "== Running chain from: $CHAIN_FILE =="
cat "$CHAIN_FILE" | $B chain 2>&1 | tail -40
