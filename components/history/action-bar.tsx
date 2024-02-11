import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { TrashIcon } from '@radix-ui/react-icons'
import { IconTag, IconFolder } from '@/components/ui/icons/next-icons'

type ActionBarProps = {
  areRowsSelected: boolean
  table: any
  onDelete: () => void
}
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
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='sm' className='gap-1 flex'>
          <IconFolder className='shrink-0' />
          Add to Folder
        </Button>
        <Button variant='ghost' size='sm' className='gap-1 flex'>
          <IconTag />
          Add Tags
        </Button>
        <Button variant='ghost' size='sm' className='gap-1 flex' onClick={onDelete}>
          <TrashIcon width={16} height={16} />
          Delete
        </Button>
      </div>
    </div>
  )
}
