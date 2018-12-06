import Fs from "fs"
import Path from "path"

const CASE_ASCII_OFFSET = 32

let input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .trim()

for (let i = 0; i < input.length; i++) {
    const currentValue = input.charAt(i)
    const nextValue = input.charAt(i + 1)

    // reached the end
    if (nextValue === undefined) {
        continue
    }

    const isSameTypeAndOppositePolarity =
        Math.abs(currentValue.charCodeAt(0) - nextValue.charCodeAt(0)) ===
        CASE_ASCII_OFFSET

    if (isSameTypeAndOppositePolarity) {
        input = input.slice(0, i) + input.slice(i + 2)
        // Coming back to previous position but since it's going to be
        // incremented by the for loop, let's take a supplementary step
        i = Math.max(-1, i - 2)
    }
}

console.log(input.length)
