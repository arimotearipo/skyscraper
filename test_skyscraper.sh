#!/bin/bash

echo "Testing C version of skyscraper puzzle solver..."
echo "=============================================="

# Test case 1: The example that produces the original solutions.txt
echo "Test 1: Input that matches original solutions.txt"
./skyscraper "1 2 4 3" "3 2 1 2" "2 2 1 2" "1 2 3 2"
echo ""

# Test case 2: The commented example from index.js
echo "Test 2: First commented example from index.js"
./skyscraper "2 2 3 1" "1 3 2 2" "3 2 1 2" "3 1 2 2"
echo ""

echo "Testing completed. Check solutions.txt for detailed output."