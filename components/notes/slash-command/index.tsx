import {
  EditorCommand,
  EditorCommandItem,
  EditorCommandEmpty,
  EditorCommandList,
} from 'novel'

import { Command, renderItems } from 'novel/extensions'
import { suggestionItems } from './suggestion-items'

const slashCommand = Command.configure({
  suggestion: {
    startOfLine: true,
    items: () => suggestionItems,
    render: renderItems,
  },
})

const SuggestionMenuCommand = () => (
  <EditorCommand className='z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all'>
    <EditorCommandEmpty className='px-2 text-muted-foreground'>
      No results
    </EditorCommandEmpty>
    <EditorCommandList>
      {suggestionItems.map((item) => (
        <EditorCommandItem
          key={item.title}
          value={item.title}
          onCommand={(val) => (item?.command ? item.command(val) : null)}
          className={`flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent `}
        >
          <div className='flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background'>
            {item.icon}
          </div>
          <div>
            <p className='font-medium'>{item.title}</p>
            <p className='text-xs text-muted-foreground'>{item.description}</p>
          </div>
        </EditorCommandItem>
      ))}
    </EditorCommandList>
  </EditorCommand>
)

export { SuggestionMenuCommand, slashCommand }
