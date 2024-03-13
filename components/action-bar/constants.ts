import { Table } from '@tanstack/react-table'

import { ENTITY_TYPE } from '@/lib/constants'
import { createCollection } from '@/lib/serverActions/collection'
import {
  addDataSourcesToCollection,
  removeDataSourceFromCollection,
  getCollectionsForDataSourceList,
} from '@/lib/serverActions/dataSource'

import {
  createTag,
  addTagToDataSources,
  removeTagFromDataSources,
  getTagsForDataSourcesList,
} from '@/lib/serverActions/tag'

export type AddToCollectionOrTagProps = {
  currentItemId?: string
  destintaionEntity: EntityType
  table: Table<HistoryItem>
}

export type DropdownItem = {
  value: string
  label: string
  containsSelectedItems: number
}

type CrudOperations = {
  [key in EntityType]: {
    createEntity: any
    createDSAndEntityConnection: any
    removeDSAndEntityConnection: any
    getExistingConnections: any
  }
}

export const CRUD_OPS: CrudOperations = {
  [ENTITY_TYPE.COLLECTION]: {
    createEntity: createCollection,
    createDSAndEntityConnection: addDataSourcesToCollection,
    removeDSAndEntityConnection: removeDataSourceFromCollection,
    getExistingConnections: getCollectionsForDataSourceList,
  },
  [ENTITY_TYPE.TAG]: {
    createEntity: createTag,
    createDSAndEntityConnection: addTagToDataSources,
    removeDSAndEntityConnection: removeTagFromDataSources,
    getExistingConnections: getTagsForDataSourcesList,
  },
}

type Labels = {
  [key in EntityType]: {
    TITLE: string
    TOOLTIP: Record<string | number, string>
  }
}

export const LABELS: Labels = {
  [ENTITY_TYPE.COLLECTION]: {
    TITLE: 'Add/Remove Items to Collection',
    TOOLTIP: {
      0: 'Add to:',
      1: 'Remove from:',
      CREATE: 'Create Collection and add Items to it',
    },
  },
  [ENTITY_TYPE.TAG]: {
    TITLE: 'Set Tags on Items',
    TOOLTIP: {
      0: 'Set Tag:',
      1: 'Remove Tag:',
      CREATE: 'Create Tag and set it on Items',
    },
  },
}
