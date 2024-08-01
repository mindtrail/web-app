import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type MentionListProps = {
  items: string[]
  command: ({ id }: { id: string }) => void
}

export default forwardRef((props: MentionListProps, ref: any) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: React.KeyboardEvent<HTMLDivElement> }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className='items'>
      {props.items.map((item, index) => (
        <button
          className={`item ${index === selectedIndex ? 'is-selected' : ''}`}
          key={index}
          onClick={() => selectItem(index)}
        >
          {item}
        </button>
      ))}
    </div>
  )
})
