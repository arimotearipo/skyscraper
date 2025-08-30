const solutions = []

const SOLUTIONS_FILE_PATH = "./solutions.txt"
const UP_POV_INDEX = 0
const RIGHT_POV_INDEX = 1
const DOWN_POV_INDEX = 2
const LEFT_POV_INDEX = 3

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

    return valueCount <= 1
}

function initBoard(rowNum, colNum) {
    // 2D rowNum x colNum array
    const board = []

    for (let i = 0; i < rowNum; i++) {
        const row = []
        for (let j = 0; j < colNum; j++) {
            row.push(0)
        }

        board.push([...row])
    }

    return board
}

function isUpPovValid(povs, board, colPos) {
    const skyscrapers = board.map((row) => row[colPos])

    const pov = povs[UP_POV_INDEX][colPos]

    const skyscraperViewed = countSeenSkyscraper(skyscrapers)

    if (pov === skyscraperViewed) {
        return true
    }

    return false
}

function isDownPovValid(povs, board, colPos) {
    const skyscrapers = board.map((row) => row[colPos]).toReversed()

    const pov = povs[DOWN_POV_INDEX][colPos]

    const skyscraperViewed = countSeenSkyscraper(skyscrapers)

    if (pov === skyscraperViewed) {
        return true
    }

    return false
}

function isLeftPovValid(povs, board, rowPos) {
    const skyscrapers = board[rowPos]

    const pov = povs[LEFT_POV_INDEX][rowPos]

    const skyscraperViewed = countSeenSkyscraper(skyscrapers)

    if (pov === skyscraperViewed) {
        return true
    }

    return false
}

function isRightPovValid(povs, board, rowPos) {
    const skyscrapers = board[rowPos].toReversed()

    const pov = povs[RIGHT_POV_INDEX][rowPos]

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
        const leftPovIsValid = isLeftPovValid(povs, board, rowPos)
        const rightPovIsValid = isRightPovValid(povs, board, rowPos)
        if (!leftPovIsValid || !rightPovIsValid) {
            return false
        }
    }

    const colIsComplete = isColComplete(board, colPos)

    if (colIsComplete) {
        const upPovIsValid = isUpPovValid(povs, board, colPos)
        const downPovIsValid = isDownPovValid(povs, board, colPos)
        if (!upPovIsValid || !downPovIsValid) {
            return false
        }
    }

    return true
}

function backtrack(board, povs, position, colNum, skyscraperHeights, skyscraperNum) {
    if (position === skyscraperNum) {
        solutions.push(board.map((b) => [...b]))
        return
    }

    const row = Math.floor(position / colNum)
    const col = position % colNum

    for (const height of skyscraperHeights) {
        board[row][col] = height

        const placementIsValid = isValidPlacement(povs, board, row, col)
        if (placementIsValid) {
            backtrack(board, povs, position + 1, colNum, skyscraperHeights, skyscraperNum)
        }

        board[row][col] = 0
    }
}


// should be 6 argv
function validateArgs(argv) {
    const instruction = `Please execute \`bun run index.js "[col1up col2up col3up col4up...]" "[row1right row2right row3right row4right...]" "[col1down col2down col3down col4down...]" "[row1left row2left row3left row4left...]"\'\n`
    const example = `Example: \`bun run index.js "4 3 2 1" "1 2 2 2" "4 3 2 1" "1 2 2 2"\'\n`

    if (argv.length !== 6) {
        return instruction + example
    }

    const povs = argv.at(-1).split(" ")

    if (povs.length % 2 !== 0) {
        return instruction + example
    }

    for (const pov of povs) {
        if (isNaN(parseInt(pov))) {
            return `${pov} is not a valid number`
        }
    }

    return ""
}

function parseBoard(board, povs, colNum) {
    const horizontalLine = "─".repeat(colNum * 2 + 1)
    const topBorder = "  ┌" + horizontalLine + "┐\n"
    const bottomBorder = "  └" + horizontalLine + "┘\n"
    const topPov = `\t\t${povs[0].join(" ")}\n`
    const bottomPov = `\t\t${povs[2].join(" ")}\n`

    let boardString = ""

    boardString += topPov
    boardString += topBorder
    
    for (const [index, row] of board.entries()) {
        const rowString = row.join(" ")
        
        const leftPov = povs[LEFT_POV_INDEX][index]
        const rightPov = povs[RIGHT_POV_INDEX][index]
        
        boardString += `${leftPov} │ ${rowString} │ ${rightPov}\n`
    }

    boardString += bottomBorder
    boardString += bottomPov

    return boardString
}

function parseArgs(argv) {
    const povs = argv.slice(-4)

    const povsArray = []

    for (const pov of povs) {
        const povGroup = pov.split(" ").map((p) => parseInt(p))
        povsArray.push(povGroup)
    }

    return povsArray
}

async function eraseFileContent() {
    await Bun.write(SOLUTIONS_FILE_PATH, "")
}

function writeToFile(povs, colNum) {
    const file = Bun.file(SOLUTIONS_FILE_PATH)

    const writer = file.writer()

    writer.write(`${solutions.length} solution(s) found\n\n`)
    solutions.forEach((solution, index) => {
        writer.write(`Solution ${index + 1}:\n`)
        writer.write(parseBoard(solution, povs, colNum))
        writer.write("\n")
    })

    writer.end()
}

const isArgsInvalid = validateArgs(Bun.argv)

if (!isArgsInvalid) {
    const povs = parseArgs(Bun.argv)
    console.log("Parsed POVs...")

    const rowNum = povs[LEFT_POV_INDEX].length
    const colNum = povs[UP_POV_INDEX].length

    const board = initBoard(rowNum, colNum)
    console.log("Initialized board...")

    const startPosition = 0 // will go from 0 to rowNum * colNum

    const maxSkyscraperHeight = Math.max(rowNum, colNum)
    const skyscraperHeights = Array.from({length: maxSkyscraperHeight}, (_, i) => i + 1)
    console.log("Skyscraper heights ", skyscraperHeights)
    const skyscraperNum = rowNum * colNum
    console.log("Skyscraper number ", skyscraperNum)


    backtrack(board, povs, startPosition, colNum, skyscraperHeights, skyscraperNum)

    if (solutions.length > 0) {
        console.log(`${solutions.length} solution(s) found`)
    }

    eraseFileContent()
    writeToFile(povs, colNum)
} else {
    console.log(isArgsInvalid)
}

// "2 2 3 1" "1 3 2 2" "3 2 1 2" "3 1 2 2"
// "3 3 3 2 2 4 2 1" "1 4 6 3 2 2 2 3" "4 3 3 3 2 1 2 3" "4 3 1 2 4 2 3 3"