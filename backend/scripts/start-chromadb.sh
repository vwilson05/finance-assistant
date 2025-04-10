#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start ChromaDB server
echo "Starting ChromaDB server..."
chroma run --path ./data/chromadb --host 0.0.0.0 --port 8000 