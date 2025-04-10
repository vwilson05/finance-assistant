#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up ChromaDB locally...${NC}"

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

# Install ChromaDB
echo -e "${YELLOW}Installing ChromaDB...${NC}"
pip3 install chromadb --break-system-packages

if [ $? -eq 0 ]; then
    echo -e "${GREEN}ChromaDB installed successfully!${NC}"
else
    echo -e "${RED}Failed to install ChromaDB.${NC}"
    exit 1
fi

# Create a directory for ChromaDB data
echo -e "${YELLOW}Creating ChromaDB data directory...${NC}"
mkdir -p backend/data/chromadb

if [ $? -eq 0 ]; then
    echo -e "${GREEN}ChromaDB data directory created successfully!${NC}"
else
    echo -e "${RED}Failed to create ChromaDB data directory.${NC}"
    exit 1
fi

# Update .env file with local ChromaDB path
echo -e "${YELLOW}Updating .env file with local ChromaDB path...${NC}"
if [ -f backend/.env ]; then
    # Check if CHROMA_DB_PATH already exists in .env
    if grep -q "CHROMA_DB_PATH" backend/.env; then
        # Update existing CHROMA_DB_PATH
        sed -i '' 's|CHROMA_DB_PATH=.*|CHROMA_DB_PATH=./data/chromadb|' backend/.env
    else
        # Add new CHROMA_DB_PATH
        echo "CHROMA_DB_PATH=./data/chromadb" >> backend/.env
    fi
    echo -e "${GREEN}.env file updated successfully!${NC}"
else
    echo -e "${RED}.env file not found. Creating new .env file...${NC}"
    echo "CHROMA_DB_PATH=./data/chromadb" > backend/.env
    echo -e "${GREEN}.env file created successfully!${NC}"
fi

echo -e "${GREEN}ChromaDB setup completed successfully!${NC}"
echo -e "${YELLOW}You can now start the application without Docker.${NC}" 