#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Financial Assistant...${NC}"

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

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker to run ChromaDB.${NC}"
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

# Start ChromaDB using Docker
echo -e "${YELLOW}Starting ChromaDB...${NC}"
docker run -d --name chromadb -p 8000:8000 chromadb/chroma:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}ChromaDB started successfully!${NC}"
else
    echo -e "${RED}Failed to start ChromaDB. It might already be running.${NC}"
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
echo -e "${YELLOW}Checking if Mistral model is available...${NC}"
ollama list | grep -q mistral
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Pulling Mistral model (this may take a while)...${NC}"
    ollama pull mistral
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Mistral model pulled successfully!${NC}"
    else
        echo -e "${RED}Failed to pull Mistral model.${NC}"
    fi
else
    echo -e "${GREEN}Mistral model is already available.${NC}"
fi

# Start the application
echo -e "${YELLOW}Starting Financial Assistant application...${NC}"
npm run dev

# Handle cleanup on script exit
trap 'echo -e "${YELLOW}Stopping services...${NC}"; docker stop chromadb; kill $(jobs -p) 2>/dev/null' EXIT 