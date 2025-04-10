#!/bin/bash

# Financial Assistant Application Startup Script

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
  echo "Node.js is not installed. Please install Node.js to continue."
  exit 1
fi

# Check if npm is installed
if ! command_exists npm; then
  echo "npm is not installed. Please install npm to continue."
  exit 1
fi

# Function to start the backend
start_backend() {
  echo "Starting backend server..."
  cd backend
  npm run dev
}

# Function to start the frontend
start_frontend() {
  echo "Starting frontend server..."
  cd frontend
  npm run dev
}

# Function to install dependencies
install_dependencies() {
  echo "Installing dependencies..."
  npm run install:all
}

# Main script
echo "Financial Assistant Application"
echo "============================="

# Check if dependencies are installed
if [ ! -d "node_modules" ] || [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
  echo "Dependencies not found. Installing..."
  install_dependencies
fi

# Start the application
echo "Starting the application..."
echo "Press Ctrl+C to stop all servers"

# Start both servers in parallel
npm run dev 