import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt")).toString()

let frequency: number = 0
let firstRepeatingFrequency: number | null = null
const seenFrequencies: Set<number> = new Set<number>()
const sequence: Array<number> = input
    .split("\n")
    .reduce((list: number[], change: string) => {
        const value = parseInt(change, 10)

        if (isNaN(value)) {
            return list
        }

        return list.concat(value)
    }, [])

while (firstRepeatingFrequency === null) {
    for (const frequencyChange of sequence) {
        frequency = frequency + frequencyChange

        if (seenFrequencies.has(frequency)) {
            firstRepeatingFrequency = frequency
            break
        }

        seenFrequencies.add(frequency)
    }
}

console.log("First repeating frequency", firstRepeatingFrequency)
