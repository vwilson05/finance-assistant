#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting required services for Financial Assistant...${NC}"

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

echo -e "${GREEN}All services started successfully!${NC}"
echo -e "${YELLOW}You can now start the Financial Assistant application.${NC}" 