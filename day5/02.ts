import Fs from "fs"
import Path from "path"

const CASE_ASCII_OFFSET = 32

let input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .trim()

let bestResult = Infinity

for (let j = 97; j < 123; j++) {
    const regexp = new RegExp(String.fromCharCode(j), "ig")
    let copy = input.replace(regexp, "")
    for (let i = 0; i < copy.length; i++) {
        const currentValue = copy.charAt(i)
        const nextValue = copy.charAt(i + 1)

        // reached the end
        if (nextValue === undefined) {
            continue
        }

        const isSameTypeAndOppositePolarity =
            Math.abs(currentValue.charCodeAt(0) - nextValue.charCodeAt(0)) ===
            CASE_ASCII_OFFSET

        if (isSameTypeAndOppositePolarity) {
            copy = copy.slice(0, i) + copy.slice(i + 2)
            // Coming back to previous position but since it's going to be
            // incremented by the for loop, let's take a supplementary step
            i = Math.max(-1, i - 2)
        }
    }

    if (copy.length < bestResult) {
        bestResult = copy.length
    }
}

console.log(bestResult)
