#!/bin/bash

# Define the path to the build directory and the main HTML file
BUILD_DIR="build"
MAIN_HTML_FILE="game.html"

# Check if the main HTML file exists in the build directory
if [[ -f "${BUILD_DIR}/${MAIN_HTML_FILE}" ]]; then
    # Open the main HTML file in the default web browser
    open "${BUILD_DIR}/${MAIN_HTML_FILE}"
else
    echo "Error: The file '${BUILD_DIR}/${MAIN_HTML_FILE}' does not exist."
    exit 1
fi