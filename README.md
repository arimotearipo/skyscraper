# Skyscraper Puzzle Solver

This repository contains both JavaScript and C implementations of a skyscraper puzzle solver.

## Files

- `index.js` - Original JavaScript implementation (requires Bun runtime)
- `skyscraper.c` - C implementation converted from JavaScript
- `Makefile` - Build configuration for C program
- `test_skyscraper.sh` - Test script for C implementation
- `solutions.txt` - Output file containing found solutions

## Building and Running the C Version

### Prerequisites
- GCC compiler
- Make

### Build
```bash
make
```

### Run
```bash
./skyscraper "up_povs" "right_povs" "down_povs" "left_povs"
```

### Example
```bash
./skyscraper "1 2 4 3" "3 2 1 2" "2 2 1 2" "1 2 3 2"
```

### Clean
```bash
make clean
```

## How it Works

The skyscraper puzzle is a logic puzzle where:
1. Numbers represent skyscraper heights on a grid
2. Each row and column must contain unique values (1 to N for NxN grid)
3. POV (Point of View) numbers around the grid indicate how many skyscrapers are visible from that direction
4. Taller skyscrapers block the view of shorter ones behind them

The solver uses backtracking algorithm to find valid solutions that satisfy all constraints.

## Algorithm Details

1. **Constraint Validation**: Checks uniqueness in rows/columns and POV visibility
2. **Backtracking**: Recursively tries all possible placements
3. **Pruning**: Early termination when constraints are violated
4. **Output**: Writes all solutions to `solutions.txt` and displays first solution

## Conversion Notes

The C version faithfully implements all features from the JavaScript original:
- Same backtracking algorithm and logic
- Identical constraint checking
- Compatible command-line interface  
- Same output format and file generation
- Handles grids up to 10x10 (configurable via MAX_SIZE)

Key differences from JavaScript:
- Static arrays instead of dynamic arrays
- Manual memory management
- Standard C I/O instead of Bun APIs
- Explicit string parsing for arguments