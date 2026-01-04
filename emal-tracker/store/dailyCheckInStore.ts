import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DailyCheckIn {
  date: string // ISO date string (YYYY-MM-DD)
  completedAt: Date
  energyLogged: boolean
  sleepLogged: boolean
  exerciseLogged: boolean
  stressLogged: boolean
}

interface DailyCheckInStore {
  checkIns: DailyCheckIn[]

  // Actions
  recordCheckIn: (checkIn: Omit<DailyCheckIn, 'completedAt'>) => void
  hasCompletedToday: () => boolean
  getCurrentStreak: () => number
  getTotalCheckIns: () => number
  getCheckInForDate: (date: string) => DailyCheckIn | undefined
}

export const useDailyCheckInStore = create<DailyCheckInStore>()(
  persist(
    (set, get) => ({
      checkIns: [],

      recordCheckIn: (checkIn) => {
        const newCheckIn: DailyCheckIn = {
          ...checkIn,
          completedAt: new Date(),
        }

        set((state) => {
          // Remove existing check-in for the same date (if any)
          const filtered = state.checkIns.filter(
            (c) => c.date !== checkIn.date
          )
          return {
            checkIns: [...filtered, newCheckIn].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
          }
        })
      },

      hasCompletedToday: () => {
        const today = new Date()
        const todayStr = today.toISOString().split('T')[0]
        const checkIns = get().checkIns
        return checkIns.some((c) => c.date === todayStr)
      },

      getCurrentStreak: () => {
        const checkIns = get().checkIns
        if (checkIns.length === 0) return 0

        const sortedCheckIns = [...checkIns].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        let streak = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = 0; i < sortedCheckIns.length; i++) {
          const expectedDate = new Date(today)
          expectedDate.setDate(today.getDate() - i)
          const expectedDateStr = expectedDate.toISOString().split('T')[0]

          if (sortedCheckIns[i].date === expectedDateStr) {
            streak++
          } else {
            break
          }
        }

        return streak
      },

      getTotalCheckIns: () => {
        return get().checkIns.length
      },

      getCheckInForDate: (date) => {
        const checkIns = get().checkIns
        return checkIns.find((c) => c.date === date)
      },
    }),
    {
      name: 'daily-check-in-storage',
    }
  )
)
