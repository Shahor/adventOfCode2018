import Fs from "fs"
import Path from "path"

const TWO = "two"
const THREE = "three"
const input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .split("\n")

const map = new Map<string, number>([[TWO, 0], [THREE, 0]])

for (const line of input) {
    const visitedLetters: Map<string, number> = new Map()

    for (const letter of line) {
        let timesSeen = 0
        if (visitedLetters.has(letter)) {
            timesSeen = visitedLetters.get(letter) || 0
        }

        visitedLetters.set(letter, timesSeen + 1)
    }

    let hasTwo = false
    let hasThree = false
    visitedLetters.forEach((value: number) => {
        if (value === 2) {
            hasTwo = true
        }

        if (value === 3) {
            hasThree = true
        }
    })

    if (hasTwo) {
        map.set(TWO, (map.get(TWO) || 0) + 1)
    }
    if (hasThree) {
        map.set(THREE, (map.get(THREE) || 0) + 1)
    }
}

console.log("Result:", (map.get(TWO) || 0) * (map.get(THREE) || 0))
