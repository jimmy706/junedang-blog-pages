#!/usr/bin/env bash
# Render a Mermaid diagram file (.mmd) into an image using the mermaid CLI.
# Usage: ./render.sh input.mmd output.png

set -euo pipefail

if [[ $# -lt 2 ]]; then
    echo "Usage: $0 <input.mmd> <output.png>" >&2
    exit 1
fi

INPUT="$1"
OUTPUT="$2"

if ! command -v mmdc &> /dev/null; then
    echo "Mermaid CLI (mmdc) not found; attempting to install via npm..."
    if ! command -v npm &> /dev/null; then
        echo "npm is not installed. Please install Node.js and npm or render the diagram using a different method." >&2
        exit 1
    fi
    npm install -g @mermaid-js/mermaid-cli
fi

echo "Rendering $INPUT to $OUTPUT..."
mmdc -i "$INPUT" -o "$OUTPUT"
echo "Generated $OUTPUT"