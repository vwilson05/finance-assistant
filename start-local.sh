#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Financial Assistant (Local Mode)...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to run the application.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm to run the application.${NC}"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Python 3 is not installed. Please install Python 3 to continue.${NC}"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo -e "${RED}pip3 is not installed. Please install pip3 to continue.${NC}"
    exit 1
fi

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo -e "${RED}Ollama is not installed. Please install Ollama from https://ollama.ai/${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm run install:all
fi

# Check if ChromaDB is installed
if ! python3 -c "import chromadb" &> /dev/null; then
    echo -e "${YELLOW}ChromaDB not found. Installing ChromaDB...${NC}"
    pip3 install chromadb
fi

# Start Ollama
echo -e "${YELLOW}Starting Ollama...${NC}"
ollama serve &

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Ollama started successfully!${NC}"
else
    echo -e "${RED}Failed to start Ollama. It might already be running.${NC}"
fi

# Pull the Mistral model if not already pulled
echo -e "${YELLOW}Checking if tinyllama model is available...${NC}"
ollama list | grep -q tinyllama
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Pulling tinyllama model (this may take a while)...${NC}"
    ollama pull tinyllama
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}tinyllama model pulled successfully!${NC}"
    else
        echo -e "${RED}Failed to pull tinyllama model.${NC}"
    fi
else
    echo -e "${GREEN}tinyllama model is already available.${NC}"
fi

# Start ChromaDB
echo -e "${YELLOW}Starting ChromaDB...${NC}"
mkdir -p data/chromadb

# Try different ports if 8000 is not available
CHROMA_PORT=8000
MAX_PORT_ATTEMPTS=5
PORT_ATTEMPT=0

while [ $PORT_ATTEMPT -lt $MAX_PORT_ATTEMPTS ]; do
    if ! lsof -i :$CHROMA_PORT > /dev/null 2>&1; then
        chroma run --path ./data/chromadb --host 0.0.0.0 --port $CHROMA_PORT &
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}ChromaDB started successfully on port $CHROMA_PORT!${NC}"
            # Update the port in the environment
            export CHROMA_PORT=$CHROMA_PORT
            break
        fi
    fi
    PORT_ATTEMPT=$((PORT_ATTEMPT + 1))
    CHROMA_PORT=$((CHROMA_PORT + 1))
done

if [ $PORT_ATTEMPT -eq $MAX_PORT_ATTEMPTS ]; then
    echo -e "${RED}Failed to start ChromaDB after trying multiple ports.${NC}"
    exit 1
fi

# Wait for ChromaDB to be ready
echo -e "${YELLOW}Waiting for ChromaDB to be ready...${NC}"
sleep 5

# Initialize vector store
echo -e "${YELLOW}Initializing vector store...${NC}"
cd backend
npm run init-vector-store

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Vector store initialized successfully!${NC}"
else
    echo -e "${RED}Failed to initialize vector store.${NC}"
    exit 1
fi

cd ..

# Start the application
echo -e "${YELLOW}Starting Financial Assistant application...${NC}"
npm run dev

# Handle cleanup on script exit
trap 'echo -e "${YELLOW}Stopping services...${NC}"; kill $(jobs -p) 2>/dev/null' EXIT 