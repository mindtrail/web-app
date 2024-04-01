import { useCallback } from 'react'
import { CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command'
import { useEditor } from 'novel'
import { Check, TextQuote, TrashIcon } from 'lucide-react'

type CompletionProps = {
  completion: string
  onDiscard: () => void
}
export const AICompletionCommands = ({ completion, onDiscard }: CompletionProps) => {
  const { editor } = useEditor()

  if (!editor) return null

  const onReplace = () => {
    const selection = editor.view.state.selection
    editor
      .chain()
      .focus()
      .insertContentAt(
        {
          from: selection.from,
          to: selection.to,
        },
        completion,
      )
      .run()
  }

  const onInsertAfter = () => {
    const selection = editor.view.state.selection
    editor
      .chain()
      .focus()
      .insertContentAt(selection.to + 1, completion)
      .run()
  }

  return (
    <>
      <CommandGroup>
        <CommandItem className='gap-2 px-4' value='replace' onSelect={onReplace}>
          <Check className='h-4 w-4 text-muted-foreground' />
          Replace selection
        </CommandItem>
        <CommandItem className='gap-2 px-4' value='insert' onSelect={onInsertAfter}>
          <TextQuote className='h-4 w-4 text-muted-foreground' />
          Insert below
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />

      <CommandGroup>
        <CommandItem onSelect={onDiscard} value='thrash' className='gap-2 px-4'>
          <TrashIcon className='h-4 w-4 text-muted-foreground' />
          Discard
        </CommandItem>
      </CommandGroup>
    </>
  )
}
