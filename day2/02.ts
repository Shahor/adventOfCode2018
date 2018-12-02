import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .split("\n")

interface StringDifference {
    numberOfDifferentChars: number
    commonLetters: string
}

function computeStringDifferences(a: string, b: string): StringDifference {
    const length = a.length // a and b have always the same length
    let commonLetters = ""
    let numberOfDifferentChars = 0

    for (let i = 0; i < length; i++) {
        if (a[i] === b[i]) {
            commonLetters += a[i]
        } else {
            numberOfDifferentChars++
        }
    }

    return { numberOfDifferentChars, commonLetters }
}

const length = input.length
// 😱 that goto label
outer: for (let i = 1; i < length; i++) {
    for (let j = 0; j < i; j++) {
        const {
            numberOfDifferentChars,
            commonLetters,
        } = computeStringDifferences(input[j], input[i])

        if (numberOfDifferentChars === 1) {
            console.log("Box id", commonLetters)
            break outer
        }
    }
}
