import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .split("\n")

interface Range {
    start: number
    end: number
}

interface LineProperties {
    id: string
    rows: Range
    columns: Range
}

type ID = string
interface Pixel {
    ids: ID[]
    hasOverlap: boolean
}

type Coordinates = string

let overlaps = 0
const canvas = new Map<Coordinates, Pixel>()
const idsWithOverlappingStatus: Map<string, boolean> = new Map()

function parseLine(line: string): LineProperties {
    const [
        _ = "",
        id = "",
        columnStart = "",
        rowStart = "",
        width = "",
        height = "",
    ] = line.match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/) || []

    return {
        id,
        columns: {
            start: parseInt(columnStart, 10),
            end: parseInt(columnStart, 10) + parseInt(width, 10),
        },
        rows: {
            start: parseInt(rowStart, 10),
            end: parseInt(rowStart, 10) + parseInt(height, 10),
        },
    }
}

input.forEach(line => {
    const lineProperties: LineProperties = parseLine(line)

    idsWithOverlappingStatus.set(lineProperties.id, false)

    for (
        let row = lineProperties.rows.start;
        row < lineProperties.rows.end;
        row++
    ) {
        for (
            let column = lineProperties.columns.start;
            column < lineProperties.columns.end;
            column++
        ) {
            const coordinnates = `${row}x${column}`
            let pixel: Pixel = { ids: [lineProperties.id], hasOverlap: false }

            // not overlapping yet
            if (canvas.has(coordinnates) === false) {
                canvas.set(coordinnates, pixel)
                continue
            }

            pixel = canvas.get(coordinnates) || pixel
            pixel.ids = [...pixel.ids, lineProperties.id]

            canvas.set(coordinnates, pixel)
            // drop it, it has already been counted
            if (pixel.hasOverlap) {
                continue
            }

            overlaps++
            pixel.ids.forEach(id => idsWithOverlappingStatus.set(id, true))
            canvas.set(coordinnates, {
                ...pixel,
                hasOverlap: true,
            })
        }
    }
})

// part 1
console.log(overlaps)

// part 2
for (const [id, overlapping] of idsWithOverlappingStatus) {
    if (overlapping === false) {
        console.log(id)
        break
    }
}
