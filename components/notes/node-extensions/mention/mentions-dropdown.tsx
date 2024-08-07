import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type MentionListProps = {
  items: string[]
  command: ({ id }: { id: string }) => void
}

const MentionsDropdown = forwardRef((props: MentionListProps, ref: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item })
    }
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent<HTMLDivElement> }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
        return true
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
        return true
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex)
        return true
      }

      return false
    },
  }))

  return (
    <div
      className='flex flex-col min-w-32 bg-white border rounded-lg shadow
      overflow-auto p-1.5 relative'
    >
      {props.items.map((item, index) => (
        <button
          className={`w-full text-start hover:bg-muted px-2 py-1 rounded-md
              ${index === selectedIndex ? 'bg-muted' : ''}
          `}
          key={index}
          onClick={() => selectItem(index)}
        >
          {item}
        </button>
      ))}
    </div>
  )
})

MentionsDropdown.displayName = 'MentionsDropdown'

export default MentionsDropdown
