import { DataSource } from '@prisma/client'

declare global {
  type HistoryItem = DataSource & {
    tags?: string[]
    displayName?: string
  }

  type HistoryViewProps = {
    userId: string
    historyItems: HistoryItem[]
    // serverCall: () => void
  }

  type HistoryFilter = {
    label: string
    value: string
  }
}
