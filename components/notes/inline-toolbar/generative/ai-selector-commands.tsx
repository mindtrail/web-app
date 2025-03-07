import { useEditor } from 'novel'
import { getPrevText } from 'novel/utils'

import {
  ArrowDownWideNarrow,
  CheckCheck,
  RefreshCcwDot,
  StepForward,
  WrapText,
} from 'lucide-react'

import { CommandGroup, CommandItem, CommandSeparator } from '@/components/ui/command'

const AIActions = [
  {
    value: 'improve',
    label: 'Improve writing',
    icon: RefreshCcwDot,
  },

  {
    value: 'fix',
    label: 'Fix grammar',
    icon: CheckCheck,
  },
  {
    value: 'shorter',
    label: 'Make shorter',
    icon: ArrowDownWideNarrow,
  },
  {
    value: 'longer',
    label: 'Make longer',
    icon: WrapText,
  },
]

interface AISelectorCommandsProps {
  onSelect: (value: string, option: string) => void
}

export const AISelectorCommands = ({ onSelect }: AISelectorCommandsProps) => {
  const { editor } = useEditor()
  if (!editor) return null

  const handleSelect = (value: string) => {
    const slice = editor.state.selection.content()
    const text = editor.storage.markdown.serializer.serialize(slice.content)
    onSelect(text, value)
  }

  return (
    <>
      <CommandGroup heading='Edit or review selection'>
        {AIActions.map((option) => (
          <CommandItem
            onSelect={handleSelect}
            className='flex gap-2 px-4'
            key={option.value}
            value={option.value}
          >
            <option.icon className='h-4 w-4' />
            {option.label}
          </CommandItem>
        ))}
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading='More actions'>
        <CommandItem
          onSelect={() => {
            const text = getPrevText(editor, 5000)
            onSelect(text, 'continue')
          }}
          value='continue'
          className='gap-2 px-4'
        >
          <StepForward className='h-4 w-4' />
          Continue writing
        </CommandItem>
      </CommandGroup>
    </>
  )
}
