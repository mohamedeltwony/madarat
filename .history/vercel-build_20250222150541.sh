#!/bin/bash

# Install npm if not available
if ! command -v npm &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install dependencies
npm install

# Build the project
npm run build 