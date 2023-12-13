import { Button } from '@/components/ui/button'

type TagsProps = {
  tagList: DataSourceTag[]
}

export const TagsCell = ({ tagList }: TagsProps) => {
  return (
    <div className='flex flex-wrap gap-2 px-2'>
      {tagList?.length
        ? tagList.map(({ tag }, index) => (
            <Button
              key={index}
              variant='outline'
              size='sm'
              className='shrink-0 max-w-full'
            >
              {tag.name}
            </Button>
          ))
        : 'No tags'}
    </div>
  )
}
