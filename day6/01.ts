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
type ID = string
type Pixel = null | ID

function getIdFromCoordinates(coords: Coordinates): ID {
    return `${coords.x}${coords.y}`
}

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

function doesBeaconHaveFiniteArea(
    beacon: Coordinates,
    beacons: Array<Coordinates>
): Boolean {
    let hasTopLeft = false
    let hasTopRight = false
    let hasBottomLeft = false
    let hasBottomRight = false

    for (let i = 0; i < beacons.length; i++) {
        const comparedBeacon = beacons[i]

        if (
            hasTopRight === false &&
            comparedBeacon.x >= beacon.x &&
            comparedBeacon.y > beacon.y
        ) {
            hasTopRight = true
        }

        if (
            hasBottomRight === false &&
            comparedBeacon.x >= beacon.x &&
            comparedBeacon.y < beacon.y
        ) {
            hasBottomRight = true
        }

        if (
            hasBottomLeft === false &&
            comparedBeacon.x <= beacon.x &&
            comparedBeacon.y < beacon.y
        ) {
            hasBottomLeft = true
        }

        if (
            hasTopLeft === false &&
            comparedBeacon.x <= beacon.x &&
            comparedBeacon.y > beacon.y
        ) {
            hasTopLeft = true
        }
    }

    return hasTopLeft && hasTopRight && hasBottomLeft && hasBottomRight
}

const coordinates = input.map(convertToCoordinates)
const beaconsWithFiniteArea: Array<Coordinates> = coordinates.reduce(
    (beacons, beacon) => {
        const hasFiniteArea = doesBeaconHaveFiniteArea(
            beacon,
            coordinates.filter(ref => ref.x !== beacon.x || ref.y !== beacon.y)
        )

        if (hasFiniteArea) {
            return [...beacons, beacon]
        }

        return beacons
    },
    [] as Array<Coordinates>
)

const boundaries: Boundaries = computeBoardBoundaries(coordinates)
console.log(JSON.stringify(boundaries))

function computePixelForCoords(
    coordinates: Coordinates,
    coordinatesList: Array<Coordinates>
): Pixel {
    const distances = coordinatesList
        .map(beacon => {
            return {
                id: getIdFromCoordinates(beacon),
                distance: computeManhattanDistance(coordinates, beacon),
            }
        })
        .sort((a, b) => a.distance - b.distance)

    if (distances[0].distance === distances[1].distance) {
        return null
    }

    return distances[0].id
}

const canvas: Array<Array<Pixel>> = []
for (let x = boundaries[0].x; x <= boundaries[1].x; x++) {
    for (let y = boundaries[0].y; y <= boundaries[1].y; y++) {
        if (canvas[x] === undefined) {
            canvas[x] = []
        }

        canvas[x][y] = computePixelForCoords({ x, y }, coordinates)
    }
}

const sorted = beaconsWithFiniteArea
    .map(beacon => {
        let count = 0
        let id = getIdFromCoordinates(beacon)

        for (let x = boundaries[0].x; x <= boundaries[1].x; x++) {
            for (let y = boundaries[0].y; y <= boundaries[1].y; y++) {
                if (canvas[x][y] === id) {
                    count++
                }
            }
        }
        return count
    })
    .sort((a, b) => b - a)

// 01
console.log(sorted[0])
