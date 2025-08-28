const solutions = []

const SKYSCRAPER_HEIGHTS = [1, 2, 3, 4]
const SKYSCRAPER_NUM = 16
const SOLUTIONS_FILE_PATH = "./solutions.txt"

function countSeenSkyscraper(skyscrapers) {
    if (skyscrapers.length === 0) {
        return 0
    }

    const nonZeroSkyscrapers = skyscrapers.filter((h) => h !== 0)

    if (nonZeroSkyscrapers.length === 0) {
        return 0
    }

    let count = 1

    let highest = nonZeroSkyscrapers[0] 
    for (let i = 1; i < nonZeroSkyscrapers.length; i++) {
        if (nonZeroSkyscrapers[i] > highest) {
            count++
            highest = nonZeroSkyscrapers[i]
        }
    }

    return count
}

function isRowUnique(board, rowPos, colPos) {
    const row = board[rowPos]
    const value = row[colPos]

    if (value === 0) {
        return true
    }

    const valueCount = row.filter((v) => v === value).length

    return valueCount <= 1
}

function isColUnique(board, rowPos, colPos) {
    const col = board.map((r) => r[colPos])
    const value = col[rowPos]

    if (value === 0) {
        return true
    }

    const valueCount = col.filter((v) => v === value).length

    if (valueCount > 1) {
        return false
    }

    return valueCount <= 1
}

function initBoard() {
    // 2D 4x4 array
    const board = []

    for (let i = 0; i < 4; i++) {
        const row = []
        for (let j = 0; j < 4; j++) {
            row.push(0)
        }

        board.push([...row])
    }

    return board
}

function isUpPovValid(povs, board, colPos) {
    const skyscrapers = board.map((row) => row[colPos])

    const pov = povs[0][colPos]

    const skyscraperViewed = countSeenSkyscraper(skyscrapers)

    if (pov === skyscraperViewed) {
        return true
    }

    return false
}

function isDownPovValid(povs, board, colPos) {
    const skyscrapers = board.map((row) => row[colPos]).toReversed()

    const pov = povs[2][colPos]

    const skyscraperViewed = countSeenSkyscraper(skyscrapers)

    if (pov === skyscraperViewed) {
        return true
    }

    return false
}

function isLeftPovValid(povs, board, rowPos) {
    const skyscrapers = board[rowPos]

    const pov = povs[3][rowPos]

    const skyscraperViewed = countSeenSkyscraper(skyscrapers)

    if (pov === skyscraperViewed) {
        return true
    }

    return false
}

function isRightPovValid(povs, board, rowPos) {
    const skyscrapers = board[rowPos].toReversed()

    const pov = povs[1][rowPos]

    const skyscraperViewed = countSeenSkyscraper(skyscrapers)

    if (pov === skyscraperViewed) {
        return true
    }

    return false
}

function isColComplete(board, colPos) {
    const col = board.map((r) => r[colPos])

    const colComplete = col.every((c) => c !== 0)

    return colComplete
}

function isRowComplete(board, rowPos) {
    const row = board[rowPos]

    const rowComplete = row.every((r) => r !== 0)

    return rowComplete
}

function isValidPlacement(povs, board, rowPos, colPos) {
    const rowIsUnique = isRowUnique(board, rowPos, colPos)
    const colIsUnique = isColUnique(board, rowPos, colPos)

    if (!rowIsUnique || !colIsUnique) {
        return false
    }

    // we only check for pov validity when a row or column is complete
    // if there is still 0 value within the row or column, this means the row or column is not yet complete and we can definitively say that the POV is false

    const rowIsComplete = isRowComplete(board, rowPos)

    if (rowIsComplete) {
        if (!isLeftPovValid(povs, board, rowPos) || !isRightPovValid(povs, board, rowPos)) {
            return false
        }
    }

    const colIsComplete = isColComplete(board, colPos)

    if (colIsComplete) {
        if (!isUpPovValid(povs, board, colPos) || !isDownPovValid(povs, board, colPos)) {
            return false
        }
    }

    return true
}

function backtrack(board, povs, position) {
    console.log("POSITION", position)
    if (position === SKYSCRAPER_NUM) {
        solutions.push(board.map((b) => [...b]))
        return
    }

    const row = Math.floor(position / 4)
    const col = position % 4

    for (const height of SKYSCRAPER_HEIGHTS) {
        board[row][col] = height

        const placementIsValid = isValidPlacement(povs, board, row, col)
        // console.log("placementIsValid", placementIsValid)
        if (placementIsValid) {
            backtrack(board, povs, position + 1)
        }

        board[row][col] = 0
    }
}


function validateArgs(argv) {
    if (argv.length !== 3) {
        return `Please execute \`bun run index.js "col1up col2up col3up col4up col1down col2down col3down col4down row1left row2left row3left row4left row1right row2right row3right row4right"\'`
    }

    const povs = argv.at(-1).split(" ")

    if (povs.length !== 16) {
        return `Please execute \`bun run index.js "col1up col2up col3up col4up col1down col2down col3down col4down row1left row2left row3left row4left row1right row2right row3right row4right"\\'nThere needs to be 16 point of views.`
    }

    for (const pov of povs) {
        if (isNaN(parseInt(pov))) {
            return `${pov} is not a valid number`
        }
    }

    return ""
}

function parseBoard(board) {
    let boardString = ""

    for (const row of board) {
        const rowString = row.join(" ")

        boardString += `| ${rowString} |\n`
    }

    return boardString
}

function parseArgs(argv) {
    const povs = argv.at(-1).split(" ")

    // 2D array
    const povsArr = []

    // represents one side of POVs
    const povGroup = []


    povs.forEach((pov) => {
        if (povGroup.length === 4) {
            povsArr.push([...povGroup])
            povGroup.splice(0) // reset the array
        }

        povGroup.push(parseInt(pov))
    })

    // pushing final group
    povsArr.push(povGroup)

    return povsArr
}

async function eraseFileContent() {
    await Bun.write(SOLUTIONS_FILE_PATH, "")
}

function writeToFile() {
    const file = Bun.file(SOLUTIONS_FILE_PATH)

    const writer = file.writer()

    writer.write(`${solutions.length} solution(s) found\n\n`)
    solutions.forEach((solution, index) => {
        writer.write(`Solution ${index + 1}:\n`)
        writer.write(parseBoard(solution))
        writer.write("\n")
    })

    writer.end()
}

const isArgsInvalid = validateArgs(Bun.argv)

if (!isArgsInvalid) {
    const board = initBoard()
    const povs = parseArgs(Bun.argv)
    const startPosition = 0 // will go from 0 to 16

    backtrack(board, povs, startPosition)

    eraseFileContent()
    writeToFile()
} else {
    console.log(isArgsInvalid)
}

// "4 3 2 1 1 2 2 2 4 3 2 1 1 2 2 2"