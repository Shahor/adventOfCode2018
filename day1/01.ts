import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt")).toString()

const resultingFrequency = input
    .split("\n")
    .reduce((frequency: number, adjustment: string) => {
        // parseInt deals with the sign like a champ
        const adjustmentAsInt = parseInt(adjustment, 10)

        if (isNaN(adjustmentAsInt)) {
            return frequency
        }

        return frequency + adjustmentAsInt
    }, 0)

console.log("Resulting frequency is", resultingFrequency)
