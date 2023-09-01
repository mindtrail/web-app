'use client'

import * as React from 'react'
import { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'

import { Sidebar } from '@/components/sidebar/sidebar'
import { SidebarList } from '@/components/sidebar/sidebar-list'
import { SidebarFooter } from '@/components/sidebar/sidebar-footer'
// import { ThemeToggle } from '@/components/theme-toggle'

// Register the plugins
registerPlugin(FilePondPluginFileValidateType)

const ACCEPTED_FILE_TYPES = [
  'application/epub+zip',
  'application/json',
  'application/octet-stream',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/x-ndjson',
  'application/x-subrip',
  'application/octet-stream',
  'text/csv',
  'text/plain',
  'text/markdown',
]

const UPLOAD_ENDPOINT = '/api/upload'
const MAX_NR_OF_FILES = 30
const UPLOAD_LABEL =
  'Drag and drop files or <span class="filepond--label-action">Browse</span>'

export function LeftSidebar() {
  const [files, setFiles] = useState([])

  function handleInit() {
    console.log('FilePond instance has initialised')
  }

  function handleUpdateFiles(fileItems: any) {
    console.log(fileItems)
    // Set current file objects to state
    setFiles(fileItems.map(async (fileItem: any) => fileItem.file))
  }

  return (
    <Sidebar>
      {/* @TODO: update the UI of the fallback to resemble filepond */}
      <React.Suspense fallback={<div className='file-upload' />}>
        <FilePond
          allowMultiple={true}
          credits={false}
          files={files}
          labelIdle={UPLOAD_LABEL}
          maxFiles={MAX_NR_OF_FILES}
          oninit={handleInit}
          onupdatefiles={handleUpdateFiles}
          server={UPLOAD_ENDPOINT}
          acceptedFileTypes={ACCEPTED_FILE_TYPES}
        ></FilePond>
      </React.Suspense>
      <React.Suspense fallback={<div className='flex-1 overflow-auto' />}>
        <SidebarList userId={'123'} />
      </React.Suspense>
      <SidebarFooter>{/* <ThemeToggle /> */}</SidebarFooter>
    </Sidebar>
  )
}
