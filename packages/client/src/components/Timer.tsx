import { useState, useEffect } from 'react'

interface Time {
  hours: number
  minutes: number
  seconds: number
}

export default function Timer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState<Time>(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = new Date(endTime).getTime() - new Date().getTime()
    let timeLeft = { hours: 0, minutes: 0, seconds: 0 }

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  const addLeadingZero = (value: number) => {
    return value < 10 ? `0${value}` : value
  }
  const TimeNumber = ({ n, s }: { n: number; s: string }) => (
    <span className="text-4xl font-light text-end w-30">
      {addLeadingZero(n)}
      <span className="text-xs text-start content-end">{s}</span>
    </span>
  )

  return (
    <div className="grid grid-cols-3 gap-2 text-center text-4xl">
      <TimeNumber n={timeLeft.hours} s="H" />
      <TimeNumber n={timeLeft.minutes} s="M" />
      <TimeNumber n={timeLeft.seconds} s="S" />
    </div>
  )
}
