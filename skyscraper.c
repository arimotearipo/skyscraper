#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_SIZE 10
#define MAX_SOLUTIONS 100
#define SOLUTIONS_FILE_PATH "solutions.txt"

// POV indices
#define UP_POV_INDEX 0
#define RIGHT_POV_INDEX 1
#define DOWN_POV_INDEX 2
#define LEFT_POV_INDEX 3

// Global variables to store solutions
int solutions[MAX_SOLUTIONS][MAX_SIZE][MAX_SIZE];
int solution_count = 0;
int grid_size = 0;

// Function to count seen skyscrapers from a direction
int countSeenSkyscraper(int* skyscrapers, int length) {
    if (length == 0) {
        return 0;
    }
    
    // Filter out zeros and count non-zero elements
    int nonZeroSkyscrapers[MAX_SIZE];
    int nonZeroCount = 0;
    
    for (int i = 0; i < length; i++) {
        if (skyscrapers[i] != 0) {
            nonZeroSkyscrapers[nonZeroCount++] = skyscrapers[i];
        }
    }
    
    if (nonZeroCount == 0) {
        return 0;
    }
    
    int count = 1;
    int highest = nonZeroSkyscrapers[0];
    
    for (int i = 1; i < nonZeroCount; i++) {
        if (nonZeroSkyscrapers[i] > highest) {
            count++;
            highest = nonZeroSkyscrapers[i];
        }
    }
    
    return count;
}

// Check if value is unique in row
bool isRowUnique(int board[MAX_SIZE][MAX_SIZE], int rowPos, int colPos, int size) {
    int value = board[rowPos][colPos];
    
    if (value == 0) {
        return true;
    }
    
    int valueCount = 0;
    for (int j = 0; j < size; j++) {
        if (board[rowPos][j] == value) {
            valueCount++;
        }
    }
    
    return valueCount <= 1;
}

// Check if value is unique in column
bool isColUnique(int board[MAX_SIZE][MAX_SIZE], int rowPos, int colPos, int size) {
    int value = board[rowPos][colPos];
    
    if (value == 0) {
        return true;
    }
    
    int valueCount = 0;
    for (int i = 0; i < size; i++) {
        if (board[i][colPos] == value) {
            valueCount++;
        }
    }
    
    return valueCount <= 1;
}

// Initialize board with zeros
void initBoard(int board[MAX_SIZE][MAX_SIZE], int size) {
    for (int i = 0; i < size; i++) {
        for (int j = 0; j < size; j++) {
            board[i][j] = 0;
        }
    }
}

// Check if up POV is valid
bool isUpPovValid(int povs[4][MAX_SIZE], int board[MAX_SIZE][MAX_SIZE], int colPos, int size) {
    int skyscrapers[MAX_SIZE];
    
    for (int i = 0; i < size; i++) {
        skyscrapers[i] = board[i][colPos];
    }
    
    int pov = povs[UP_POV_INDEX][colPos];
    int skyscraperViewed = countSeenSkyscraper(skyscrapers, size);
    
    return pov == skyscraperViewed;
}

// Check if down POV is valid
bool isDownPovValid(int povs[4][MAX_SIZE], int board[MAX_SIZE][MAX_SIZE], int colPos, int size) {
    int skyscrapers[MAX_SIZE];
    
    // Reverse the column
    for (int i = 0; i < size; i++) {
        skyscrapers[i] = board[size - 1 - i][colPos];
    }
    
    int pov = povs[DOWN_POV_INDEX][colPos];
    int skyscraperViewed = countSeenSkyscraper(skyscrapers, size);
    
    return pov == skyscraperViewed;
}

// Check if left POV is valid
bool isLeftPovValid(int povs[4][MAX_SIZE], int board[MAX_SIZE][MAX_SIZE], int rowPos, int size) {
    int skyscrapers[MAX_SIZE];
    
    for (int j = 0; j < size; j++) {
        skyscrapers[j] = board[rowPos][j];
    }
    
    int pov = povs[LEFT_POV_INDEX][rowPos];
    int skyscraperViewed = countSeenSkyscraper(skyscrapers, size);
    
    return pov == skyscraperViewed;
}

// Check if right POV is valid
bool isRightPovValid(int povs[4][MAX_SIZE], int board[MAX_SIZE][MAX_SIZE], int rowPos, int size) {
    int skyscrapers[MAX_SIZE];
    
    // Reverse the row
    for (int j = 0; j < size; j++) {
        skyscrapers[j] = board[rowPos][size - 1 - j];
    }
    
    int pov = povs[RIGHT_POV_INDEX][rowPos];
    int skyscraperViewed = countSeenSkyscraper(skyscrapers, size);
    
    return pov == skyscraperViewed;
}

// Check if column is complete (no zeros)
bool isColComplete(int board[MAX_SIZE][MAX_SIZE], int colPos, int size) {
    for (int i = 0; i < size; i++) {
        if (board[i][colPos] == 0) {
            return false;
        }
    }
    return true;
}

// Check if row is complete (no zeros)
bool isRowComplete(int board[MAX_SIZE][MAX_SIZE], int rowPos, int size) {
    for (int j = 0; j < size; j++) {
        if (board[rowPos][j] == 0) {
            return false;
        }
    }
    return true;
}

// Check if current placement is valid
bool isValidPlacement(int povs[4][MAX_SIZE], int board[MAX_SIZE][MAX_SIZE], int rowPos, int colPos, int size) {
    bool rowIsUnique = isRowUnique(board, rowPos, colPos, size);
    bool colIsUnique = isColUnique(board, rowPos, colPos, size);
    
    if (!rowIsUnique || !colIsUnique) {
        return false;
    }
    
    // Check POV validity only when row or column is complete
    bool rowIsComplete = isRowComplete(board, rowPos, size);
    
    if (rowIsComplete) {
        bool leftPovIsValid = isLeftPovValid(povs, board, rowPos, size);
        bool rightPovIsValid = isRightPovValid(povs, board, rowPos, size);
        if (!leftPovIsValid || !rightPovIsValid) {
            return false;
        }
    }
    
    bool colIsComplete = isColComplete(board, colPos, size);
    
    if (colIsComplete) {
        bool upPovIsValid = isUpPovValid(povs, board, colPos, size);
        bool downPovIsValid = isDownPovValid(povs, board, colPos, size);
        if (!upPovIsValid || !downPovIsValid) {
            return false;
        }
    }
    
    return true;
}

// Backtracking function to solve the puzzle
void backtrack(int board[MAX_SIZE][MAX_SIZE], int povs[4][MAX_SIZE], int position, int size, int* skyscraperHeights, int skyscraperNum) {
    if (position == skyscraperNum) {
        // Found a solution, store it
        if (solution_count < MAX_SOLUTIONS) {
            for (int i = 0; i < size; i++) {
                for (int j = 0; j < size; j++) {
                    solutions[solution_count][i][j] = board[i][j];
                }
            }
            solution_count++;
        }
        return;
    }
    
    int row = position / size;
    int col = position % size;
    
    for (int h = 0; h < size; h++) {
        int height = skyscraperHeights[h];
        board[row][col] = height;
        
        bool placementIsValid = isValidPlacement(povs, board, row, col, size);
        if (placementIsValid) {
            backtrack(board, povs, position + 1, size, skyscraperHeights, skyscraperNum);
        }
        
        board[row][col] = 0;
    }
}

// Parse command line arguments
bool parseArgs(int argc, char* argv[], int povs[4][MAX_SIZE], int* size) {
    if (argc != 5) {
        printf("Usage: %s \"up_povs\" \"right_povs\" \"down_povs\" \"left_povs\"\n", argv[0]);
        printf("Example: %s \"4 3 2 1\" \"1 2 2 2\" \"4 3 2 1\" \"1 2 2 2\"\n", argv[0]);
        return false;
    }
    
    for (int pov_idx = 0; pov_idx < 4; pov_idx++) {
        char* token = strtok(argv[pov_idx + 1], " ");
        int count = 0;
        
        while (token != NULL && count < MAX_SIZE) {
            int value = atoi(token);
            if (value <= 0) {
                printf("Invalid POV value: %s\n", token);
                return false;
            }
            povs[pov_idx][count] = value;
            count++;
            token = strtok(NULL, " ");
        }
        
        if (pov_idx == 0) {
            *size = count;
        } else if (count != *size) {
            printf("All POV arrays must have the same length\n");
            return false;
        }
    }
    
    return true;
}

// Print board with POVs
void printBoard(int board[MAX_SIZE][MAX_SIZE], int povs[4][MAX_SIZE], int size) {
    // Print top POVs
    printf("\t\t");
    for (int j = 0; j < size; j++) {
        printf("%d ", povs[UP_POV_INDEX][j]);
    }
    printf("\n");
    
    // Print top border
    printf("  ┌");
    for (int j = 0; j < size * 2 + 1; j++) {
        printf("─");
    }
    printf("┐\n");
    
    // Print board with left and right POVs
    for (int i = 0; i < size; i++) {
        printf("%d │ ", povs[LEFT_POV_INDEX][i]);
        for (int j = 0; j < size; j++) {
            printf("%d", board[i][j]);
            if (j < size - 1) printf(" ");
        }
        printf(" │ %d\n", povs[RIGHT_POV_INDEX][i]);
    }
    
    // Print bottom border
    printf("  └");
    for (int j = 0; j < size * 2 + 1; j++) {
        printf("─");
    }
    printf("┘\n");
    
    // Print bottom POVs
    printf("\t\t");
    for (int j = 0; j < size; j++) {
        printf("%d ", povs[DOWN_POV_INDEX][j]);
    }
    printf("\n");
}

// Write solutions to file
void writeToFile(int povs[4][MAX_SIZE], int size) {
    FILE* file = fopen(SOLUTIONS_FILE_PATH, "w");
    if (file == NULL) {
        printf("Error: Cannot open file %s for writing\n", SOLUTIONS_FILE_PATH);
        return;
    }
    
    fprintf(file, "%d solution(s) found\n\n", solution_count);
    
    for (int s = 0; s < solution_count; s++) {
        fprintf(file, "Solution %d:\n", s + 1);
        
        // Print top POVs to file
        fprintf(file, "\t\t");
        for (int j = 0; j < size; j++) {
            fprintf(file, "%d ", povs[UP_POV_INDEX][j]);
        }
        fprintf(file, "\n");
        
        // Print top border to file
        fprintf(file, "  ┌");
        for (int j = 0; j < size * 2 + 1; j++) {
            fprintf(file, "─");
        }
        fprintf(file, "┐\n");
        
        // Print board with left and right POVs to file
        for (int i = 0; i < size; i++) {
            fprintf(file, "%d │ ", povs[LEFT_POV_INDEX][i]);
            for (int j = 0; j < size; j++) {
                fprintf(file, "%d", solutions[s][i][j]);
                if (j < size - 1) fprintf(file, " ");
            }
            fprintf(file, " │ %d\n", povs[RIGHT_POV_INDEX][i]);
        }
        
        // Print bottom border to file
        fprintf(file, "  └");
        for (int j = 0; j < size * 2 + 1; j++) {
            fprintf(file, "─");
        }
        fprintf(file, "┘\n");
        
        // Print bottom POVs to file
        fprintf(file, "\t\t");
        for (int j = 0; j < size; j++) {
            fprintf(file, "%d ", povs[DOWN_POV_INDEX][j]);
        }
        fprintf(file, "\n\n");
    }
    
    fclose(file);
}

int main(int argc, char* argv[]) {
    int povs[4][MAX_SIZE];
    int board[MAX_SIZE][MAX_SIZE];
    int size;
    
    // Parse command line arguments
    if (!parseArgs(argc, argv, povs, &size)) {
        return 1;
    }
    
    printf("Parsed POVs...\n");
    grid_size = size;
    
    // Initialize board
    initBoard(board, size);
    printf("Initialized board...\n");
    
    // Create array of skyscraper heights (1 to size)
    int skyscraperHeights[MAX_SIZE];
    for (int i = 0; i < size; i++) {
        skyscraperHeights[i] = i + 1;
    }
    
    printf("Skyscraper heights: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", skyscraperHeights[i]);
    }
    printf("\n");
    
    int skyscraperNum = size * size;
    printf("Skyscraper number: %d\n", skyscraperNum);
    
    // Reset solution count
    solution_count = 0;
    
    // Solve the puzzle
    backtrack(board, povs, 0, size, skyscraperHeights, skyscraperNum);
    
    if (solution_count > 0) {
        printf("%d solution(s) found\n", solution_count);
        
        // Print first solution to console
        if (solution_count > 0) {
            printf("\nSolution 1:\n");
            printBoard(solutions[0], povs, size);
        }
    } else {
        printf("No solutions found\n");
    }
    
    // Write solutions to file
    writeToFile(povs, size);
    
    return 0;
}