import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { TrashIcon } from '@radix-ui/react-icons'
import { IconTag, IconFolder } from '@/components/ui/icons/next-icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import { AddToFolder } from '@/components/history/add-to-folder'

type ActionBarProps = {
  areRowsSelected: boolean
  table: any
  onDelete: () => void
}

const actionBarBtnStyle = cn(
  'flex items-center gap-1',
  buttonVariants({ variant: 'ghost', size: 'sm' }),
)

export const ActionBar = ({ areRowsSelected, table, onDelete }: ActionBarProps) => {
  return (
    <div
      className={`absolute invisible w-full h-10 bg-background border-b shadow-sm
    flex items-center first-letter:top-0 px-4 z-20 gap-4 rounded-t-md
    ${areRowsSelected && '!visible'}`}
    >
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
      <div className='flex items-center gap-4 ml-2'>
        <Popover>
          <PopoverTrigger className={actionBarBtnStyle}>
            <IconFolder className='shrink-0' />
            Add to Folder
          </PopoverTrigger>
          <PopoverContent className='w-64' align='start'>
            <AddToFolder />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger className={actionBarBtnStyle}>
            <IconTag className='shrink-0' />
            Add Tags
          </PopoverTrigger>
          <PopoverContent className='w-64' align='start'>
            Tags
          </PopoverContent>
        </Popover>

        <Button
          variant='ghost'
          size='sm'
          className='gap-1 flex hover:text-destructive'
          onClick={onDelete}
        >
          <TrashIcon width={16} height={16} />
          Delete
        </Button>
      </div>
    </div>
  )
}
