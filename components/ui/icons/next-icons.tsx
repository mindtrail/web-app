'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

function IconNextChat({
  className,
  inverted,
  ...props
}: React.ComponentProps<'svg'> & { inverted?: boolean }) {
  const id = React.useId()

  return (
    <svg
      viewBox='0 0 17 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <defs>
        <linearGradient
          id={`gradient-${id}-1`}
          x1='10.6889'
          y1='10.3556'
          x2='13.8445'
          y2='14.2667'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor={inverted ? 'white' : 'black'} />
          <stop offset={1} stopColor={inverted ? 'white' : 'black'} stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id={`gradient-${id}-2`}
          x1='11.7555'
          y1='4.8'
          x2='11.7376'
          y2='9.50002'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor={inverted ? 'white' : 'black'} />
          <stop offset={1} stopColor={inverted ? 'white' : 'black'} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d='M1 16L2.58314 11.2506C1.83084 9.74642 1.63835 8.02363 2.04013 6.39052C2.4419 4.75741 3.41171 3.32057 4.776 2.33712C6.1403 1.35367 7.81003 0.887808 9.4864 1.02289C11.1628 1.15798 12.7364 1.8852 13.9256 3.07442C15.1148 4.26363 15.842 5.83723 15.9771 7.5136C16.1122 9.18997 15.6463 10.8597 14.6629 12.224C13.6794 13.5883 12.2426 14.5581 10.6095 14.9599C8.97637 15.3616 7.25358 15.1692 5.74942 14.4169L1 16Z'
        fill={inverted ? 'black' : 'white'}
        stroke={inverted ? 'black' : 'white'}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <mask
        id='mask0_91_2047'
        style={{ maskType: 'alpha' }}
        maskUnits='userSpaceOnUse'
        x={1}
        y={0}
        width={16}
        height={16}
      >
        <circle cx={9} cy={8} r={8} fill={inverted ? 'black' : 'white'} />
      </mask>
      <g mask='url(#mask0_91_2047)'>
        <circle cx={9} cy={8} r={8} fill={inverted ? 'black' : 'white'} />
        <path
          d='M14.2896 14.0018L7.146 4.8H5.80005V11.1973H6.87681V6.16743L13.4444 14.6529C13.7407 14.4545 14.0231 14.2369 14.2896 14.0018Z'
          fill={`url(#gradient-${id}-1)`}
        />
        <rect
          x='11.2222'
          y='4.8'
          width='1.06667'
          height='6.4'
          fill={`url(#gradient-${id}-2)`}
        />
      </g>
    </svg>
  )
}

function IconOpenAI({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill='currentColor'
      viewBox='0 0 24 24'
      role='img'
      xmlns='http://www.w3.org/2000/svg'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <title>OpenAI icon</title>
      <path d='M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z' />
    </svg>
  )
}

function IconVercel({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-label='Vercel logomark'
      role='img'
      viewBox='0 0 74 64'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path
        d='M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z'
        fill='currentColor'
      ></path>
    </svg>
  )
}

function IconGitHub({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      role='img'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <title>GitHub</title>
      <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12' />
    </svg>
  )
}

function IconSeparator({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill='none'
      shapeRendering='geometricPrecision'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='1'
      viewBox='0 0 24 24'
      aria-hidden='true'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M16.88 3.549L7.12 20.451'></path>
    </svg>
  )
}

function IconArrowDown({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='m205.66 149.66-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32Z' />
    </svg>
  )
}

function IconArrowRight({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='m221.66 133.66-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32Z' />
    </svg>
  )
}

function IconUser({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z' />
    </svg>
  )
}

function IconPlus({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8Z' />
    </svg>
  )
}

function IconArrowElbow({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z' />
    </svg>
  )
}

function IconSpinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4 animate-spin', className)}
      {...props}
    >
      <path d='M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z' />
    </svg>
  )
}

function IconMessage({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M216 48H40a16 16 0 0 0-16 16v160a15.84 15.84 0 0 0 9.25 14.5A16.05 16.05 0 0 0 40 240a15.89 15.89 0 0 0 10.25-3.78.69.69 0 0 0 .13-.11L82.5 208H216a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16ZM40 224Zm176-32H82.5a16 16 0 0 0-10.3 3.75l-.12.11L40 224V64h176Z' />
    </svg>
  )
}

function IconTrash({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z' />
    </svg>
  )
}

function IconRefresh({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M197.67 186.37a8 8 0 0 1 0 11.29C196.58 198.73 170.82 224 128 224c-37.39 0-64.53-22.4-80-39.85V208a8 8 0 0 1-16 0v-48a8 8 0 0 1 8-8h48a8 8 0 0 1 0 16H55.44C67.76 183.35 93 208 128 208c36 0 58.14-21.46 58.36-21.68a8 8 0 0 1 11.31.05ZM216 40a8 8 0 0 0-8 8v23.85C192.53 54.4 165.39 32 128 32c-42.82 0-68.58 25.27-69.66 26.34a8 8 0 0 0 11.3 11.34C69.86 69.46 92 48 128 48c35 0 60.24 24.65 72.56 40H168a8 8 0 0 0 0 16h48a8 8 0 0 0 8-8V48a8 8 0 0 0-8-8Z' />
    </svg>
  )
}

function IconStop({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm24-120h-48a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8Zm-8 48h-32v-32h32Z' />
    </svg>
  )
}

function IconSidebar({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z' />
    </svg>
  )
}

function IconMoon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M233.54 142.23a8 8 0 0 0-8-2 88.08 88.08 0 0 1-109.8-109.8 8 8 0 0 0-10-10 104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88 104.84 104.84 0 0 0 37-52.91 8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104 106 106 0 0 0 14.92-1.06 89 89 0 0 1-26.02 31.4Z' />
    </svg>
  )
}

function IconSun({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm72 88a64 64 0 1 1-64-64 64.07 64.07 0 0 1 64 64Zm-16 0a48 48 0 1 0-48 48 48.05 48.05 0 0 0 48-48ZM58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm80 80a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Zm112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Z' />
    </svg>
  )
}

function IconCopy({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z' />
    </svg>
  )
}

function IconCheck({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z' />
    </svg>
  )
}

function IconDownload({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M224 152v56a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-56a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0Zm-101.66 5.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 132.69V40a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z' />
    </svg>
  )
}

function IconClose({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 256 256'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d='M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z' />
    </svg>
  )
}

function IconEdit({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
      />
    </svg>
  )
}

function IconShare({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      viewBox='0 0 256 256'
      {...props}
    >
      <path d='m237.66 106.35-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z' />
    </svg>
  )
}

function IconUsers({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      viewBox='0 0 256 256'
      {...props}
    >
      <path d='M117.25 157.92a60 60 0 1 0-66.5 0 95.83 95.83 0 0 0-47.22 37.71 8 8 0 1 0 13.4 8.74 80 80 0 0 1 134.14 0 8 8 0 0 0 13.4-8.74 95.83 95.83 0 0 0-47.22-37.71ZM40 108a44 44 0 1 1 44 44 44.05 44.05 0 0 1-44-44Zm210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16 44 44 0 1 0-16.34-84.87 8 8 0 1 1-5.94-14.85 60 60 0 0 1 55.53 105.64 95.83 95.83 0 0 1 47.22 37.71 8 8 0 0 1-2.33 11.07Z' />
    </svg>
  )
}

function IconExternalLink({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      className={cn('h-4 w-4', className)}
      viewBox='0 0 256 256'
      {...props}
    >
      <path d='M224 104a8 8 0 0 1-16 0V59.32l-66.33 66.34a8 8 0 0 1-11.32-11.32L196.68 48H152a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Zm-40 24a8 8 0 0 0-8 8v72H48V80h72a8 8 0 0 0 0-16H48a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-72a8 8 0 0 0-8-8Z' />
    </svg>
  )
}

function IconMultipleFolders({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M7.06914 2.08382C6.93821 2.12151 6.81018 2.17135 6.68631 2.23283C6.16018 2.5421 5.69202 3.15064 5.5192 3.75042C5.4481 3.99333 5.43716 4.14735 5.41857 5.08895L5.39888 6.15327L4.16262 6.17706C3.33898 6.1971 3.72277 6.21087 3.51057 6.29101C2.87615 6.53142 2.27892 7.2226 2.08094 7.94634L2 8.24059V15.9552L2.08094 16.2494C2.28221 16.9844 2.8674 17.6556 3.51932 17.8998L3.78621 17.9999L12.5681 18L12.835 17.8998C13.1602 17.7713 13.4564 17.5614 13.702 17.2855C13.9475 17.0095 14.1364 16.6745 14.2547 16.3046C14.3488 16.0091 14.3532 16.5058 14.3718 15.484L14.3904 15.484L15.3201 15.4627C16.2127 15.4414 16.2608 15.4364 16.519 15.3287C16.8421 15.1932 17.1348 14.9771 17.3758 14.6959C17.6168 14.4148 17.8002 14.0758 17.9125 13.7035L18 13.3979V6.55726L17.9125 6.25174C17.7999 5.87943 17.6165 5.5404 17.3755 5.25911C17.1345 4.97783 16.8419 4.76131 16.519 4.62521L16.2499 4.51252L13.8238 4.5L12.5681 4.48873L11.2683 3.38855L9.57865 2L8.9724 2.00243C7.48698 2.00494 7.3065 2.01245 7.06914 2.08382ZM10.8658 4.38901L12.1655 5.48919L13.5131 5.50171L16.0311 5.51423L16.2378 5.6094C16.6097 5.78094 16.8909 6.10274 17.0418 6.52972L17.1249 6.76637V13.1888L17.0418 13.4255C16.8909 13.8512 16.6097 14.173 16.2378 14.3458L16.0311 14.441L7.40385 14.4409L7.19712 14.3457C7.01548 14.263 6.8505 14.1387 6.71227 13.9804C6.57403 13.8222 6.46545 13.6333 6.39316 13.4254L6.31003 13.1888L6.30019 8.36802C6.29362 5.39419 6.30237 4.55054 6.32425 4.38901C6.42051 3.6803 6.87882 3.14313 7.47167 3.04421C7.57449 3.02668 8.23297 3.0104 8.93521 3.00665L9.17722 3.00171L10.8658 4.38901ZM5.41638 9.76665C5.43497 13.4317 5.43497 13.4392 5.51701 13.7134C5.72921 14.4296 6.27831 15.0632 6.91601 15.3299L7.18509 15.4426L9.81491 15.464L13.4792 15.484L13.4759 15.3588C13.4738 16.2228 13.4672 15.7649 13.3928 15.9828C13.2495 16.4048 12.9662 16.7303 12.5921 16.9031L12.3854 16.9983L3.96888 16.9982L3.76215 16.9031C3.58051 16.8203 3.41553 16.696 3.27729 16.5378C3.13906 16.3795 3.03048 16.1907 2.95819 15.9827L2.87506 15.7461L2.86412 12.5414C2.85756 9.56756 2.8674 8.72391 2.88928 8.56239C2.98553 7.85493 3.44275 7.31776 4.0367 7.21759C4.13952 7.20006 5.01823 7.18754 5.39888 7.1913V7.19631L5.41638 9.76665Z'
        fill='currentColor'
      />
    </svg>
  )
}

function IconFolder({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M3.87726 3.0882C3.4344 3.21681 3.03263 3.46606 2.71347 3.81017C2.39431 4.15428 2.12619 4.56257 2.01869 5.02734C2.00982 5.07169 2.00455 4.83631 2.00197 4.83634C1.99774 4.83639 2.00075 5.47156 2.00695 9.02472L2.01943 15.9246L2.11176 16.2087C2.24904 16.5981 2.46726 16.9512 2.75086 17.2429C3.03446 17.5346 3.37646 17.7577 3.75248 17.8962L4.05692 18H15.9656L16.27 17.8962C16.648 17.76 16.9914 17.5365 17.2743 17.2424C17.5572 16.9483 17.7723 16.5913 17.9033 16.1983L18.0031 15.8805V8.12985L17.9033 7.81336C17.7748 7.42768 17.5656 7.07646 17.2907 6.78508C17.0158 6.49369 16.6821 6.2694 16.3137 6.12841L16.0068 6.01167L12.3037 6L10.9579 5.98833L7.73878 3L5.34695 3.00259C4.17233 3.00033 4.14369 3.00896 3.96682 3.06227C3.94134 3.06995 3.91277 3.07856 3.87726 3.0882ZM11.9506 7.03639L10.5 7.02471L7.28087 4.03769L5.30577 4.04287C4.44416 4.04596 4.4171 4.0572 4.38441 4.07077C4.37587 4.07432 4.36694 4.07803 4.34265 4.08179C3.6664 4.18426 3.14236 4.74201 3.03381 5.47488C3.03155 5.49021 3.02939 5.50149 3.02735 5.51215C3.00697 5.61876 2.9983 5.6641 3.00511 9.08958L3.01759 15.6652L3.11241 15.9091C3.19448 16.1247 3.3182 16.3205 3.47593 16.4845C3.63366 16.6485 3.82205 16.7771 4.02947 16.8624L4.26528 16.9623H15.7572L15.993 16.8624C16.2005 16.7771 16.3888 16.6485 16.5466 16.4845C16.7043 16.3205 16.828 16.1247 16.9101 15.9091L17.0049 15.6652V11.8793V8.34647L16.9101 8.10131C16.7379 7.6603 16.4173 7.32694 15.993 7.14794L15.7572 7.04936L11.9506 7.03639Z'
        fill='currentColor'
      />
    </svg>
  )
}

function IconAllData({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M9.95214 2.00206C7.53354 2.07307 5.47573 2.55442 4.17855 3.35338C3.82804 3.5694 3.34699 4.04878 3.20823 4.32299C2.98415 4.76389 2.9934 4.48376 3.00471 10.112L3.01396 15.2145L3.10236 15.4483C3.43025 16.3064 4.43243 16.9781 6.11404 17.4654C7.36908 17.8294 8.76905 18 10.5 18C11.8712 18 12.7192 17.926 13.8406 17.711C15.3896 17.4141 16.6087 16.9101 17.2974 16.2827C17.6068 16.0006 17.7774 15.7629 17.8976 15.4483L17.986 15.2145L17.9953 10.112C18.0066 4.48376 18.0158 4.76389 17.7918 4.32299C17.653 4.04878 17.172 3.5694 16.8215 3.35338C15.6928 2.65799 13.8735 2.1727 11.939 2.05039C11.2776 2.01002 10.6148 1.9939 9.95214 2.00206ZM12.2649 3.2942C13.6597 3.44413 14.9178 3.76075 15.737 4.16615C16.3455 4.46798 16.7012 4.80236 16.7012 5.07164C16.7012 5.67727 15.1039 6.421 13.1386 6.73072C12.2402 6.87177 11.8537 6.89643 10.5 6.89643C9.14628 6.89643 8.7598 6.87177 7.86144 6.73072C5.89613 6.421 4.29881 5.67727 4.29881 5.07164C4.29881 4.70767 4.94329 4.23914 5.93622 3.88306C6.68143 3.61576 7.8491 3.37607 8.78858 3.29815L9.35186 3.24981C9.63658 3.22417 11.9359 3.25968 12.2649 3.2942ZM4.69249 7.0651C5.80979 7.61253 7.31255 7.96861 9.06097 8.09881C10.0197 8.14616 10.9803 8.14616 11.939 8.09881C13.6875 7.96861 15.1902 7.61253 16.3075 7.0651L16.6755 6.88558C16.6899 6.87966 16.7012 7.60563 16.7012 8.49829V10.1219L16.6015 10.2738C16.1646 10.9336 14.3196 11.5698 12.2135 11.7849C11.6327 11.8441 9.36728 11.8441 8.78653 11.7849C6.6804 11.5698 4.83536 10.9336 4.39851 10.2738L4.29881 10.1219V8.49829C4.29881 7.60563 4.31012 6.87966 4.32451 6.88558L4.69249 7.0651ZM4.69249 11.9969C5.80979 12.5444 7.31255 12.9005 9.06097 13.0307C10.1187 13.1096 11.8198 13.0701 12.8466 12.9429C14.1603 12.7791 15.4061 12.4388 16.3075 11.9969L16.6755 11.8174C16.6899 11.8115 16.7012 12.5375 16.7012 13.4301V15.0537L16.6015 15.2056C16.1646 15.8655 14.3196 16.5017 12.2135 16.7167C11.6327 16.7759 9.36728 16.7759 8.78653 16.7167C6.6804 16.5017 4.83536 15.8655 4.39851 15.2056L4.29881 15.0537V13.4301C4.29881 12.5375 4.31012 11.8115 4.32451 11.8174L4.69249 11.9969Z'
        fill='currentColor'
      />
    </svg>
  )
}

function IconCancel({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={cn('icon icon-tabler icon-tabler-x', className)}
      width='20'
      height='20'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='#2c3e50'
      fill='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M18 6l-12 12' />
      <path d='M6 6l12 12' />
    </svg>
  )
}

function IconIdea({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={cn('icon icon-tabler icon-tabler-bulb', className)}
      width='21'
      height='21'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='#2c3e50'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7' />
      <path d='M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3' />
      <path d='M9.7 17l4.6 0' />
    </svg>
  )
}

function IconDotsVertical({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={cn('icon icon-tabler icon-tabler-dots-vertical', className)}
      width='20'
      height='20'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='#2c3e50'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <path d='M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
      <path d='M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0' />
    </svg>
  )
}

function IconTag({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.56511 2.0569C3.94861 2.18747 3.38361 2.49462 2.93926 2.94077C2.49491 3.38693 1.99218 3.85938 1.99997 4.6322L1.99998 7.57229C2.00391 10.0117 2.05866 9.90234 2.66956 10.6118C2.90687 10.8612 2.98577 10.9818 6.60832 14.6071C8.67233 16.6732 9.40606 17.4157 9.53021 17.5053C10.0102 17.8517 10.4813 18 11.0965 18C11.6785 18 12.1429 17.8628 12.6018 17.5562C12.8424 17.3947 17.3004 12.9538 17.5044 12.6716C17.8502 12.1936 17.9999 11.7233 17.9999 11.108C17.9999 10.4938 17.8513 10.0235 17.5044 9.54434C17.4146 9.4204 16.7053 8.65351 14.6357 6.59298C11.0043 2.97655 10.8635 2.84154 10.5964 2.71096C10.0743 2.45644 9.96617 2.28711 7.49218 2.0502C5.77797 1.95516 4.74912 2.01707 4.56511 2.0569ZM9.75254 3.30321C10.0667 3.42865 10.0621 3.32071 14.1114 7.36429C16.772 10.1094 16.8182 10.112 16.9246 10.3334C17.1552 10.8181 17.1552 11.399 16.9246 11.8826C16.8193 12.1028 17.0377 11.8947 14.4616 14.4676C11.8844 17.0394 12.093 16.8215 11.8724 16.9266C11.6296 17.0402 11.3647 17.0992 11.0965 17.0992C10.8283 17.0992 10.5634 17.0402 10.3206 16.9266C10.0989 16.8203 10.8472 17.5419 7.38094 14.0837C4.36806 11.0759 3.42776 10.0892 3.30607 9.95219C3.27599 9.80919 2.84121 9.82704 2.90348 7.36314C2.91789 4.5313 2.90792 4.6475 3.18172 4.12517C3.36462 3.77327 3.78473 3.35386 4.1328 3.1757C4.44983 3.01192 5.05508 2.86529 5.35659 2.82656C6.20881 2.7171 8.93261 2.91589 9.75254 3.30321ZM6.29325 5.25946C6.0263 5.31988 5.78466 5.46137 5.60155 5.66448C5.41368 5.85632 5.29278 6.10352 5.25681 6.3694C5.18032 6.80651 5.30115 7.19936 5.61263 7.53245C5.74034 7.66819 5.89455 7.77637 6.06576 7.85032C6.23696 7.92427 6.42152 7.96242 6.60806 7.96242C6.7946 7.96242 6.97916 7.92427 7.15036 7.85032C7.32156 7.77637 7.47577 7.66819 7.60348 7.53245C7.91275 7.20268 8.03468 6.79987 7.95709 6.36054C7.92047 6.09238 7.79616 5.8438 7.60348 5.65341C7.40971 5.44228 7.15193 5.30039 6.86966 5.2495C6.60695 5.20191 6.55818 5.20302 6.29325 5.25946ZM6.93617 6.27644C7.03704 6.37714 7.05145 6.41698 7.05145 6.59293C7.05145 6.7711 7.03704 6.80872 6.93063 6.91496C6.82421 7.02119 6.78652 7.03558 6.60806 7.03558C6.42959 7.03558 6.3919 7.02119 6.28549 6.91496C6.17907 6.80872 6.16466 6.7711 6.16466 6.59515C6.16466 6.43358 6.1824 6.37714 6.25667 6.29636C6.38193 6.16246 6.46839 6.13037 6.65905 6.14697C6.71159 6.14879 6.76323 6.16121 6.81085 6.18345C6.85847 6.2057 6.9011 6.23733 6.93617 6.27644Z'
        fill='currentColor'
      />
    </svg>
  )
}

function IconSearch({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={cn('icon icon-tabler icon-tabler-search', className)}
      width='20'
      height='20'
      viewBox='0 0 24 24'
      strokeWidth='1.5'
      stroke='#2c3e50'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
      <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
      <path d='M21 21l-6 -6' />
    </svg>
  )
}

function IconHighlight({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M13.333 2.01514C12.8568 2.05673 12.3984 2.22046 11.9999 2.49132C11.8471 2.59628 10.1869 4.27452 6.88696 7.65974L2 12.6724V16.5581H2.43038V17H6.21449L11.0961 11.983C14.2389 8.75242 16.0293 6.88635 16.1218 6.74383C16.4446 6.24555 16.6028 5.68982 16.6028 5.05012C16.6028 4.18835 16.3241 3.49451 15.7388 2.89238C15.0889 2.22616 14.268 1.92675 13.333 2.01514ZM14.0689 2.95093C14.464 3.03991 14.8261 3.2433 15.1121 3.53701C15.3981 3.83072 15.5962 4.20245 15.6828 4.60819C15.7829 5.09763 15.7237 5.55392 15.4989 6.02237C15.3966 6.23671 15.2804 6.38697 14.9534 6.73278L14.5391 7.1714L13.0554 5.65004L11.5727 4.12869L11.9988 3.70112C12.3366 3.36193 12.4787 3.24592 12.6906 3.13876C13.1147 2.91317 13.6022 2.84673 14.0689 2.95093ZM10.6345 11.172L7.36253 14.5329L5.88203 13.0138L4.4026 11.4946L7.67563 8.13371L10.9476 4.77391L12.4281 6.29306L13.9075 7.8111L10.6345 11.172ZM6.2769 15.6466L5.81962 16.1172L4.3488 16.1073L2.87905 16.0985L2.86937 14.5893L2.85968 13.0801L3.31696 12.6094L3.77424 12.1387L5.25475 13.6579L6.73418 15.177L6.2769 15.6466ZM11.5626 14.7174L9.33861 17H18V12.4337H13.7855L11.5626 14.7174ZM17.121 14.7174V16.0985L14.3149 16.1073C12.7709 16.1128 11.5088 16.104 11.5088 16.0896C11.5088 16.0742 12.1092 15.4444 12.8441 14.6898L14.1804 13.3165L15.6512 13.3264L17.121 13.3364V14.7174Z'
        fill='currentColor'
      />
    </svg>
  )
}
export {
  IconHighlight,
  IconSearch,
  IconTag,
  IconDotsVertical,
  IconIdea,
  IconCancel,
  IconAllData,
  IconMultipleFolders,
  IconFolder,
  IconEdit,
  IconNextChat,
  IconOpenAI,
  IconVercel,
  IconGitHub,
  IconSeparator,
  IconArrowDown,
  IconArrowRight,
  IconUser,
  IconPlus,
  IconArrowElbow,
  IconSpinner,
  IconMessage,
  IconTrash,
  IconRefresh,
  IconStop,
  IconSidebar,
  IconMoon,
  IconSun,
  IconCopy,
  IconCheck,
  IconDownload,
  IconClose,
  IconShare,
  IconUsers,
  IconExternalLink,
}
