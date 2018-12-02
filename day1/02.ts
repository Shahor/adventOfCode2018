import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt")).toString()

function* cycleEndlessly<T>(collection: Array<T>): IterableIterator<T> {
    const length: number = collection.length

    let i = 0
    while (true) {
        yield collection[i]

        // Finished cycling
        if (i === length - 1) {
            i = 0
            // Let's go back at the beginning
            continue
        }

        i++
    }
}

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

for (const frequencyChange of cycleEndlessly(sequence)) {
    frequency = frequency + frequencyChange

    if (seenFrequencies.has(frequency)) {
        firstRepeatingFrequency = frequency
        break
    }

    seenFrequencies.add(frequency)
}

console.log("First repeating frequency", firstRepeatingFrequency)
