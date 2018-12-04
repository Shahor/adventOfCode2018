import Fs from "fs"
import Path from "path"

const input = Fs.readFileSync(Path.join(__dirname, "input.txt"))
    .toString()
    .split("\n")
    .sort()

type GuardId = number
type Minutes = number

interface GuardSleepLog {
    total: number
    minuteMap: Map<Minutes, number>
}

interface SleepStats {
    duration: Minutes
    start: Minutes
    end: Minutes
}

function timeToMinutes(time: string): Minutes {
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

const { log } = input.reduce(
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
            const guardSleepLog = data.log.get(data.currentGuard) || {
                total: 0,
                minuteMap: new Map<Minutes, number>(),
            }

            const { duration, start, end } = computeSleepTime(
                data.currentStartTime,
                wakeUpTime
            )
            const totalTime = guardSleepLog.total + duration

            for (let i = start; i < end; i++) {
                guardSleepLog.minuteMap.set(
                    i,
                    (guardSleepLog.minuteMap.get(i) || 0) + 1
                )
            }

            data.log.set(data.currentGuard, {
                ...guardSleepLog,
                total: totalTime,
            })
        }

        return data
    },
    {
        currentGuard: 0,
        currentStartTime: "",
        log: new Map<GuardId, GuardSleepLog>(),
    }
)

// Step 1
const mostLikelyToSleep = [...log].reduce(
    (mostLikely, [id, sleepLog]) => {
        if (sleepLog.total > mostLikely.sleepLog.total) {
            return { id, sleepLog }
        }

        return mostLikely
    },
    {
        id: 0,
        sleepLog: {
            total: 0,
            minuteMap: new Map<Minutes, number>(),
        },
    }
)

const { minute } = [...mostLikelyToSleep.sleepLog.minuteMap].reduce(
    (mostLikely, [minute, count]) => {
        if (count > mostLikely.count) {
            return {
                minute,
                count,
            }
        }
        return mostLikely
    },
    {
        minute: 0,
        count: 0,
    }
)

console.log(
    `Guard ${mostLikelyToSleep.id} slept for ${
        mostLikelyToSleep.sleepLog.total
    } minutes. ID: ${mostLikelyToSleep.id * minute}`
)
