import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .sort()

type GuardId = number
type Minute = number
type GuardCount = Map<GuardId, number>
type MinuteDetails = Map<Minute, GuardCount>

interface SleepStats {
    duration: Minute
    start: Minute
    end: Minute
}

function timeToMinutes(time: string): Minute {
    const [_, minutes] = time.split(":")

    return parseInt(minutes, 10)
}

function computeSleepTime(startTime: string, endTime: string): SleepStats {
    const [startHour] = startTime.split(":")
    const [endHour, endMinutes] = endTime.split(":")

    // finished on next day
    if (parseInt(startHour, 10) > parseInt(endHour, 10)) {
        endTime = `${parseInt(endHour, 10) + 24}:${endMinutes}`
    }

    const startTimeInMinutes = timeToMinutes(startTime)
    const endTimeInMinutes = timeToMinutes(endTime)

    return {
        duration: endTimeInMinutes - startTimeInMinutes,
        start: startTimeInMinutes,
        end: endTimeInMinutes,
    }
}

const { minuteDetail } = input.reduce(
    (data, log: string) => {
        if (log.includes("Guard")) {
            const [_ = undefined, id = ""] = log.match(/#(\d+)+\s/) || []
            data.currentGuard = parseInt(id, 10)
        }

        if (log.includes("asleep")) {
            const [startTime = ""] = log.match(/(\d+:\d+)/) || []
            data.currentStartTime = startTime
        }

        if (log.includes("wakes up")) {
            const [wakeUpTime = ""] = log.match(/(\d+:\d+)/) || []

            const { start, end } = computeSleepTime(
                data.currentStartTime,
                wakeUpTime
            )

            for (let minute = start; minute < end; minute++) {
                const detail =
                    data.minuteDetail.get(minute) || new Map<GuardId, number>()

                detail.set(
                    data.currentGuard,
                    (detail.get(data.currentGuard) || 0) + 1
                )

                data.minuteDetail.set(minute, detail)
            }
        }

        return data
    },
    {
        currentGuard: 0,
        currentStartTime: "",
        minuteDetail: new Map<Minute, GuardCount>(),
    }
)

const guardMinutePair = [...minuteDetail]
    .map(([minute, guards]) => {
        return {
            minute,
            guard: [...guards].reduce((guardA, guardB) => {
                if ([...guardA.values()][1] < [...guardB.values()][1]) {
                    return guardB
                }

                return guardA
            }),
        }
    })
    .sort((a, b) => b.guard[1] - a.guard[1])

const guard = guardMinutePair[0].guard[0]
const minute = guardMinutePair[0].minute
console.log(`Guard is ${guard}, minute is : ${minute}: ${guard * minute}`)
