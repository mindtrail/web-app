import { Table } from '@tanstack/react-table'
import { Link1Icon } from '@radix-ui/react-icons'

import { Checkbox } from '@/components/ui/checkbox'
import { getTableHeaders } from '@/lib/constants'

type FirstColHeadProps<TData> = {
  table: Table<TData>
  resourceType?: string
}

export function FirstColHeader<TData>({ table, resourceType }: FirstColHeadProps<TData>) {
  return (
    <div className='flex items-center gap-2 px-2 group/saved-item'>
      <Link1Icon className='group-hover/saved-item:invisible' />
      <Checkbox
        className='absolute hidden group-hover/saved-item:block'
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
      {getTableHeaders(resourceType).displayName}
    </div>
  )
}
