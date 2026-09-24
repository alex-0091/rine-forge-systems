#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing Node.js dependencies and building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Installing Python dependencies..."
pip install -r requirements.txt
