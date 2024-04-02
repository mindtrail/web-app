import { useCallback } from 'react'
import { EditorBubbleItem, EditorInstance, useEditor } from 'novel'
import {
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  TextQuote,
  ListOrdered,
  TextIcon,
  Code,
  CheckSquare,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components//ui/button'
import { PopoverSelector } from '../popover-selector'

export type SelectorItem = {
  name: string
  icon: LucideIcon
  command: (editor: EditorInstance) => void
  isActive: (editor: EditorInstance) => boolean
}

const items: SelectorItem[] = [
  {
    name: 'Text',
    icon: TextIcon,
    command: (editor) => editor.chain().focus().clearNodes().run(),
    // I feel like there has to be a more efficient way to do this – feel free to PR if you know how!
    isActive: (editor) =>
      editor.isActive('paragraph') &&
      !editor.isActive('bulletList') &&
      !editor.isActive('orderedList'),
  },
  {
    name: 'Heading 1',
    icon: Heading1,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    name: 'Heading 2',
    icon: Heading2,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    name: 'Heading 3',
    icon: Heading3,
    command: (editor) =>
      editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    name: 'To-do List',
    icon: CheckSquare,
    command: (editor) => editor.chain().focus().clearNodes().toggleTaskList().run(),
    isActive: (editor) => editor.isActive('taskItem'),
  },
  {
    name: 'Bullet List',
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    name: 'Numbered List',
    icon: ListOrdered,
    command: (editor) => editor.chain().focus().clearNodes().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    name: 'Quote',
    icon: TextQuote,
    command: (editor) => editor.chain().focus().clearNodes().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
  {
    name: 'Code',
    icon: Code,
    command: (editor) => editor.chain().focus().clearNodes().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
]
interface NodeSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const NodeSelector = ({ open, onOpenChange }: NodeSelectorProps) => {
  const { editor } = useEditor()

  const activeItem = items.filter((item) => editor && item.isActive(editor)).pop() ?? {
    name: 'Multiple',
  }

  const NodeSelectorContent = useCallback(
    () =>
      items.map((item, index) => (
        <EditorBubbleItem
          key={index}
          onSelect={(editor) => {
            item.command(editor)
            onOpenChange(false)
          }}
          className='flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent'
        >
          <div className='flex items-center space-x-2'>
            <div className='rounded-sm border p-1'>
              <item.icon className='h-3 w-3' />
            </div>
            <span>{item.name}</span>
          </div>
          {activeItem.name === item.name && <Check className='h-4 w-4' />}
        </EditorBubbleItem>
      )),
    [onOpenChange, activeItem.name],
  )

  const NodeSelectorTrigger = useCallback(
    () => (
      <Button size='sm' variant='ghost' className='gap-2'>
        <span className='whitespace-nowrap text-sm'>{activeItem.name}</span>
        <ChevronDown className='h-4 w-4' />
      </Button>
    ),
    [activeItem.name],
  )

  if (!editor) return null

  return (
    <PopoverSelector
      renderTrigger={NodeSelectorTrigger}
      renderContent={NodeSelectorContent}
      contentProps={{ className: 'w-48 p-1' }}
    />
  )
}
