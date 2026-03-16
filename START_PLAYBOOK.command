#!/bin/bash
# Go to the folder this script lives in
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

clear
echo "╔══════════════════════════════════════════╗"
echo "║       Condense Playbook Launcher         ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Initialize NVM if it exists
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "🚀 Starting development server..."
echo "📱 Network access is enabled"
echo ""

# Open browser after 3 seconds
(sleep 3 && open "http://localhost:5173") &

# Start Vite with host flag for mobile access
npm run dev -- --host
