export {}

declare global {
  interface ClippingRange {
    startContainer: string
    startOffset: number
    endContainer: string
    endOffset: number
    commonAncestorContainer: string
  }

  interface SurroundingText {
    before: string
    after: string
  }

  interface TextPosition {
    start: number
    end: number
  }

  interface SavedClipping {
    id: string
    userId: string
    dataSourceId: string
    content: string
    selector: {
      range: ClippingRange
      surroundingText: SurroundingText
      textPosition: TextPosition
      color?: string
      externalResources?: []
      pageNumber?: number
    }
    notes?: []
    type?: string
  }
}
