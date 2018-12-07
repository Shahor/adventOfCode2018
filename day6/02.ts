import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .trim()
    .split("\n")

interface Coordinates {
    x: number
    y: number
}
type Distance = number
type Boundaries = [Coordinates, Coordinates]

function convertToCoordinates(line: string): Coordinates {
    const [x, y] = line.split(", ")

    return { x: parseInt(x, 10), y: parseInt(y, 10) }
}

function computeManhattanDistance(a: Coordinates, b: Coordinates): Distance {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function computeBoardBoundaries(coords: Array<Coordinates>): Boundaries {
    return coords.reduce(
        (boundaries: Boundaries, coordinate: Coordinates, index: number) => {
            let [topLeftBoundary, bottomRightBoundary] = boundaries

            if (index === 0) {
                return [{ ...coordinate }, { ...coordinate }] as Boundaries
            }

            if (coordinate.x < topLeftBoundary.x) {
                topLeftBoundary.x = coordinate.x
            }
            if (coordinate.y < topLeftBoundary.y) {
                topLeftBoundary.y = coordinate.y
            }

            if (coordinate.x > bottomRightBoundary.x) {
                bottomRightBoundary.x = coordinate.x
            }
            if (coordinate.y > bottomRightBoundary.y) {
                bottomRightBoundary.y = coordinate.y
            }

            return [topLeftBoundary, bottomRightBoundary] as Boundaries
        },
        [
            // first element is top left boundary
            { x: 0, y: 0 },
            // last element is bottom right boundary
            { x: 0, y: 0 },
        ] as Boundaries
    )
}

const coordinates = input.map(convertToCoordinates)
const boundaries: Boundaries = computeBoardBoundaries(coordinates)
const MAX_DISTANCE = 10000

let closestSum: number = -Infinity
let position: Coordinates = { x: Infinity, y: Infinity }
let numberOfPixelsForRegion: number = 0
for (let x = boundaries[0].x; x <= boundaries[1].x; x++) {
    for (let y = boundaries[0].y; y <= boundaries[1].y; y++) {
        const beacon = { x, y }
        const sum = coordinates.reduce((total, point) => {
            return total + computeManhattanDistance(beacon, point)
        }, 0)

        if (sum < MAX_DISTANCE) {
            numberOfPixelsForRegion++

            if (sum > closestSum) {
                closestSum = sum
                position = { x, y }
            }
        }
    }
}

console.log(
    `Chosen position ${JSON.stringify(
        position
    )} with sum ${closestSum} and region size: ${numberOfPixelsForRegion}`
)
