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
      className={cn('h-4 w-4', className)}
      fill='currentColor'
      viewBox='0 0 15 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M4.5692 0.583822C4.43827 0.621514 4.31023 0.671346 4.18636 0.732826C3.66023 1.0421 3.19208 1.65064 3.01925 2.25042C2.94815 2.49333 2.93721 2.14735 2.91862 3.08895L2.89893 4.15327L2.62597 4.17706C2.40234 4.20312 2.18612 4.21087 1.97392 4.29101C1.3395 4.53142 0.742275 5.2226 0.544293 5.94634L0.5 6.24059L0.5 12.4569L0.519531 12.7617C0.628377 13.5504 1.34808 14.2051 2 14.4492C2.10925 14.4897 2.16188 14.4999 2.24953 14.5016L9.06804 14.5017L9.33494 14.4015C9.6602 14.273 9.95636 14.0631 10.2019 13.7872C10.4475 13.5112 10.6363 13.1762 10.7547 12.8063C10.8488 12.5108 10.8718 12.484 10.8718 12.484L10.8904 12.484L11.8201 12.4627C12.7127 12.4414 12.7608 12.4364 13.019 12.3287C13.3421 12.1932 13.6348 11.9771 13.8758 11.6959C14.1168 11.4148 14.3002 11.0758 14.4125 10.7035C14.5019 10.3984 14.5024 10.321 14.5 10.1888V4.76637L14.4125 4.25174C14.2999 3.87943 14.1165 3.5404 13.8755 3.25911C13.6345 2.97783 13.342 2.76131 13.019 2.62521L12.7499 2.51252L10.3238 2.5L9.06808 2.48873L8.11265 1.54421L7.0787 0.5L6.47245 0.502433C4.98704 0.504937 4.80656 0.51245 4.5692 0.583822ZM7.5 2.32408L8.66555 3.48919L10.0131 3.50171L12.5311 3.51423L12.7379 3.6094C13.1098 3.78094 13.2659 4.10274 13.4169 4.52972L13.5 4.76637V10.1888L13.4169 10.4255C13.2659 10.8512 13.1098 11.173 12.7379 11.3458L12.5311 11.441L4.90391 11.4409L4.69718 11.3457C4.51554 11.263 4.35056 11.1387 4.21232 10.9804C4.06289 10.8234 4.00947 10.7854 3.89844 10.5859C3.87047 10.5357 3.82164 10.344 3.81009 10.1888L3.80024 6.36802C3.79368 3.39419 3.80243 3.05054 3.82431 2.88901C3.92056 2.1803 4.37887 1.64313 4.97173 1.54421C5.07455 1.52668 5.73303 1.5104 6.43526 1.50665L6.67727 1.50171L7.5 2.32408ZM2.91643 7.76665C2.91643 10.5 2.93503 10.4392 3.01706 10.7134C3.22927 11.4296 3.77837 12.0632 4.41606 12.3299L4.68515 12.4426L7.31497 12.464L9.97923 12.484L9.83587 12.4832L9.89279 12.4845C9.7495 12.9065 9.4662 13.232 9.09211 13.4048L8.88538 13.5L2.4322 13.4999C2.29947 13.4614 2.1937 13.4321 2.10547 13.3789C2.10547 13.3789 1.87885 13.1977 1.74061 13.0395C1.60238 12.8812 1.50781 12.7266 1.5 12.4569V12.2478V9.54139C1.49344 6.56756 1.47812 6.66153 1.5 6.5C1.59626 5.79254 1.9061 5.31776 2.50005 5.21759C2.60287 5.20006 2.71484 5.19141 2.89893 5.1913V5.19631L2.91643 7.76665Z'
      />
    </svg>
  )
}

function IconCollection({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill='currentColor'
      viewBox='0 0 15 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M1.29596 1.173C1.05596 1.319 1.06196 1.76303 1.07296 3.895L1.08296 6.219L1.21696 6.341C1.30467 6.42946 1.42251 6.48159 1.54696 6.487C1.65496 6.5 3.02096 6.506 3.97296 6.5C6.09802 6.489 6.15 6.486 6.248 6.413C6.304 6.371 6.383 6.292 6.425 6.236C6.499 6.137 6.5 5.69997 6.5 3.842C6.5 1.73303 6.512 1.331 6.251 1.172C6.139 1.104 5.60898 1.101 3.80096 1.101C1.99295 1.101 1.40796 1.104 1.29596 1.173ZM8.739 1.063C8.495 1.225 8.5 1.67703 8.5 3.727C8.5 5.79597 8.496 6.274 8.757 6.426C8.881 6.498 8.941 6.5 11.169 6.5C12.973 6.5 13.544 6.498 13.664 6.427C13.7425 6.37553 13.8082 6.30677 13.856 6.226C13.92 6.106 13.924 5.46498 13.924 3.754C13.924 1.77903 13.925 1.286 13.724 1.101L13.625 1.009L11.194 1C9.31899 0.99 8.845 0.992001 8.739 1.063ZM5.49201 3.837V5.48H2.05496V2.091H5.49201V3.837ZM12.898 3.727V5.492H9.49V1.981L12.898 1.981V3.727ZM1.26596 8.56C1.18859 8.60298 1.12246 8.66363 1.07296 8.737C1.00196 8.852 0.999963 9.40903 0.999963 11.226C0.999963 13.351 0.99196 13.79 1.27096 13.925C1.42096 13.998 1.98795 14 3.75796 14C5.47398 14 6.106 13.996 6.226 13.932C6.30677 13.8842 6.37553 13.8185 6.427 13.74C6.498 13.62 6.5 13.049 6.5 11.245C6.5 9.43103 6.498 8.88 6.426 8.756C6.274 8.495 6.31502 8.499 3.73596 8.5C2.11395 8.501 1.36996 8.508 1.26596 8.56ZM8.766 8.572C8.68977 8.62322 8.62423 8.68878 8.573 8.765C8.503 8.88 8.501 9.44403 8.5 11.249V13.623L8.584 13.747C8.756 14.005 9.212 14 11.255 14C13.277 14 13.751 14.004 13.924 13.768C13.999 13.667 14 13.129 14 11.245C14 9.36203 13.999 8.833 13.924 8.731C13.751 8.496 13.279 8.499 11.237 8.5C9.454 8.5 8.881 8.502 8.766 8.572ZM5.492 11.245V13.01H1.98996V9.489H5.492V11.245ZM12.992 11.246V13.011L11.246 13.002L9.509 12.992L9.499 11.236L9.489 9.489H12.992V11.246Z' />
    </svg>
  )
}

function IconFolder({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill='currentColor'
      viewBox='0 0 15 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M2.37726 1.0882C1.9344 1.21681 1.53263 1.46606 1.21347 1.81017C0.894314 2.15428 0.626188 2.56257 0.51869 3.02734C0.509819 3.07169 0.504552 2.83631 0.501973 2.83634C0.497736 2.83639 0.50075 1.47414 0.506955 5.0273L0.519432 11.9272L0.611761 12.2113C0.749044 12.6007 0.967261 12.9538 1.25086 13.2455C1.53446 13.5372 1.87646 13.7603 2.25248 13.8988L2.55692 14.0026H12.4625L12.767 13.8988C13.145 13.7626 13.4884 13.5391 13.7713 13.245C14.0542 12.9509 14.2692 12.5939 14.4002 12.2009L14.5 11.8831V5.59606L14.4002 5.27956C14.2718 4.89388 14.0625 4.54267 13.7876 4.25128C13.5127 3.95989 13.179 3.73561 12.8106 3.59462L12.5037 3.47788L10.8037 3.46621L9.4579 3.45453L6.23878 1L3.84695 1.00259C2.67233 1.00033 2.64369 1.00896 2.46682 1.06227C2.44134 1.06995 2.41277 1.07856 2.37726 1.0882ZM10.4506 4.50259L9 4.49092L5.78087 2.03769L3.80577 2.04287C2.94416 2.04596 2.9171 2.0572 2.88441 2.07077C2.87587 2.07432 2.86694 2.07803 2.84265 2.08179C2.1664 2.18426 1.64236 2.74201 1.53381 3.47488C1.53155 3.49021 1.52939 3.50149 1.52735 3.51215C1.50697 3.61876 1.4983 1.66667 1.50511 5.09215L1.51759 11.6678L1.61241 11.9116C1.69448 12.1273 1.8182 12.3231 1.97593 12.4871C2.13366 12.6511 2.32205 12.7797 2.52947 12.865L2.76528 12.9649H12.2542L12.49 12.865C12.6974 12.7797 12.8858 12.6511 13.0435 12.4871C13.2012 12.3231 13.3249 12.1273 13.407 11.9116L13.5018 11.6678V7.88184V5.81267L13.407 5.56752C13.2348 5.1265 12.9142 4.79315 12.49 4.61415L12.2542 4.51556L10.4506 4.50259Z'
      />
    </svg>
  )
}

// className={cn('h-4 w-4', className)}
function IconAllData({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill='currentColor'
      viewBox='0 0 15 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M6.56594 0.525331C5.42106 0.624224 4.11973 0.841063 2.92325 1.30105C1.85806 1.71205 1.20268 2.2546 1.04234 2.85975C1.00014 3.02034 0.995443 2.63451 1.00294 7.50023L1.01138 12.0839L1.08171 12.25C1.56648 13.3968 3.45851 14.1924 6.73005 14.4628C7.03875 14.4881 7.29331 14.5006 7.54857 14.5002C7.7973 14.4999 8.04669 14.4874 8.34748 14.4628C9.79525 14.3431 10.6346 14.1407 11.6136 13.8286C12.8447 13.4367 13.6492 12.8851 13.9183 12.25L13.9886 12.0839C13.9886 12.0839 13.9896 12.3659 13.9971 7.50023C14.0046 2.63451 13.9999 3.02034 13.9577 2.85975C13.7973 2.25551 13.1392 1.71023 12.0768 1.30105C11.0697 0.913645 10.1366 0.659608 8.61285 0.525331C8.38192 0.504939 8.00711 0.498656 7.62942 0.500231C7.21731 0.501949 6.80177 0.513022 6.56594 0.525331ZM8.00338 1.38906C10.3991 1.52696 12.1264 2.0804 12.8569 2.79624C13.1269 3.06207 13.1269 2.90222 12.8569 3.16805C11.8564 4.14972 9.57786 4.58548 7.07417 4.53079C4.67841 4.39288 2.87357 3.88389 2.14312 3.16805C1.87307 2.90222 1.87308 3.06207 2.14313 2.79624C2.86139 2.0922 4.68499 1.52696 7.00386 1.39087C7.39319 1.36767 7.61394 1.3683 8.00338 1.38906ZM2.37285 4.42462C3.25239 4.86374 4.45247 5.22575 5.949 5.39087C7.15458 5.54456 8.50152 5.4624 9.12854 5.39087C11.2846 5.14492 11.9708 4.80296 12.8175 4.32301L13.051 4.19055L13.0594 6.41632C13.0594 7.50023 13.0913 7.62663 12.7697 7.91242C11.862 8.71717 10.2847 9.27968 7.50359 9.27968C5.90863 9.27968 3.87968 8.87232 2.68696 8.22724C2.38596 8.06393 2.03717 7.76907 1.97528 7.62572C1.94153 7.54679 1.93309 7.00023 1.93309 6.40997L1.93309 4.17966L2.06624 4.25859C2.13938 4.30214 2.2772 4.37654 2.37285 4.42462ZM2.30815 9.06103C3.3199 9.59541 4.69905 9.96377 6.73006 10.1307C7.33954 10.1815 7.73799 10.1815 8.34748 10.1307C10.4526 9.95742 11.8142 9.56184 12.8166 8.9948L13.051 8.86234L13.0594 10.8429C13.0594 11.5002 13.0913 11.9587 12.7697 12.2436C11.862 13.0484 10.2847 13.6109 7.50359 13.6109C5.90862 13.6109 3.87968 13.2035 2.68695 12.5584C2.38596 12.3951 2.03717 12.1012 1.97528 11.9569C1.94152 11.878 1.93309 11.5002 1.93309 10.8348V8.84963L2.00341 8.89318C2.04186 8.91768 2.17875 8.99298 2.30815 9.06103Z'
      />
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

function IconTag({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill='currentColor'
      viewBox='0 0 15 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M5.574 1.07002C5.48654 1.10918 5.41497 1.17688 5.371 1.26202C5.338 1.32802 5.156 1.97102 4.965 2.69102L4.618 3.99902H3.27C1.976 3.99902 1.915 4.00202 1.779 4.06802C1.70038 4.11106 1.63371 4.173 1.585 4.24824C1.53629 4.32349 1.50708 4.40967 1.5 4.49902C1.50708 4.58837 1.53629 4.67456 1.585 4.7498C1.63371 4.82504 1.70038 4.88698 1.779 4.93002C1.914 4.99602 1.977 4.99902 3.127 4.99902C3.791 4.99902 4.334 5.01002 4.334 5.02402C4.335 5.03802 4.039 6.16302 3.677 7.52402L3.018 9.99902H1.72C0.477 9.99902 0.415 10.002 0.279 10.068C0.200379 10.1111 0.133708 10.173 0.0850005 10.2482C0.0362932 10.3235 0.00708156 10.4097 0 10.499C0.00708156 10.5884 0.0362932 10.6746 0.0850005 10.7498C0.133708 10.825 0.200379 10.887 0.279 10.93C0.414 10.996 0.478 10.999 1.577 10.999C2.321 10.999 2.733 11.011 2.733 11.032C2.733 11.05 2.591 11.601 2.417 12.255C2.242 12.91 2.1 13.475 2.1 13.511C2.1 13.548 2.132 13.644 2.171 13.726C2.19035 13.7729 2.21878 13.8155 2.25464 13.8514C2.29051 13.8872 2.33311 13.9157 2.38 13.935C2.558 14.016 2.647 14.015 2.827 13.927C2.87393 13.9084 2.91652 13.8803 2.95213 13.8445C2.98774 13.8088 3.01561 13.766 3.034 13.719C3.067 13.644 3.248 13.001 3.436 12.291L3.779 10.999H6.456C8.208 10.999 9.133 11.01 9.133 11.032C9.133 11.05 8.991 11.601 8.817 12.255C8.642 12.91 8.5 13.475 8.5 13.511C8.5 13.548 8.532 13.644 8.571 13.726C8.59035 13.7729 8.61878 13.8155 8.65464 13.8514C8.69051 13.8872 8.73311 13.9157 8.78 13.935C8.958 14.016 9.047 14.015 9.227 13.927C9.27393 13.9084 9.31652 13.8803 9.35213 13.8445C9.38774 13.8088 9.41561 13.766 9.434 13.719C9.467 13.644 9.648 13.001 9.836 12.291L10.179 10.999H11.379C12.522 10.999 12.586 10.996 12.721 10.93C12.7996 10.887 12.8663 10.825 12.915 10.7498C12.9637 10.6746 12.9929 10.5884 13 10.499C12.9929 10.4097 12.9637 10.3235 12.915 10.2482C12.8663 10.173 12.7996 10.1111 12.721 10.068C12.587 10.003 12.521 9.99902 11.523 9.99902C10.767 9.99902 10.467 9.98802 10.467 9.96202C10.467 9.94102 10.762 8.81602 11.123 7.46202L11.78 4.99902H12.929C14.022 4.99902 14.086 4.99602 14.221 4.93002C14.2996 4.88698 14.3663 4.82504 14.415 4.7498C14.4637 4.67456 14.4929 4.58837 14.5 4.49902C14.4929 4.40967 14.4637 4.32349 14.415 4.24824C14.3663 4.173 14.2996 4.11106 14.221 4.06802C14.087 4.00302 14.021 3.99902 13.073 3.99902C12.35 3.99902 12.067 3.98802 12.067 3.96202C12.067 3.94102 12.209 3.38902 12.383 2.73602C12.557 2.08202 12.7 1.51902 12.7 1.48402C12.6873 1.41014 12.6634 1.33864 12.629 1.27202C12.5879 1.19324 12.5268 1.12665 12.4519 1.07891C12.3769 1.03117 12.2908 1.00397 12.202 1.00002C12.053 0.998022 11.835 1.13002 11.771 1.26102C11.738 1.32802 11.556 1.97102 11.365 2.69102L11.018 3.99902H8.343C6.384 3.99902 5.667 3.98902 5.667 3.96202C5.667 3.94102 5.809 3.38902 5.983 2.73602C6.157 2.08202 6.3 1.51902 6.3 1.48402C6.28733 1.41014 6.26338 1.33864 6.229 1.27202C6.20965 1.22514 6.18122 1.18253 6.14536 1.14667C6.10949 1.1108 6.06689 1.08237 6.02 1.06302C5.842 0.982022 5.748 0.983023 5.574 1.07002ZM10.734 5.02402C10.735 5.03802 10.439 6.16302 10.077 7.52402L9.418 9.99902H6.742C4.794 9.99902 4.067 9.98902 4.067 9.96202C4.067 9.94102 4.362 8.81602 4.723 7.46202L5.38 4.99902H8.056C9.529 4.99902 10.734 5.01002 10.734 5.02402Z'
        fill='currentColor'
      />
    </svg>
  )
}

function IconAddToCollection({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill='currentColor'
      viewBox='0 0 15 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M1.22293 1.072C0.982926 1.218 0.988928 1.76303 0.999928 3.895L1.00993 6.219L1.14393 6.341C1.23164 6.42946 1.34947 6.48159 1.47393 6.487C1.58193 6.5 3.97296 6.5 3.97296 6.5C3.97296 6.5 6.14999 6.486 6.24799 6.413C6.30399 6.371 6.38299 6.292 6.42499 6.236C6.49899 6.137 6.49999 5.69997 6.49999 3.842C6.49999 1.73303 6.51199 1.23 6.25099 1.071C6.13899 1.003 5.60897 1 3.80096 1C1.99294 1 1.33493 1.003 1.22293 1.072ZM5.492 3.837V5.48L1.98193 5.48V1.99L5.492 1.99V3.837ZM1.26595 8.56C1.18858 8.60298 1.12245 8.66363 1.07295 8.737C1.00195 8.852 0.999954 9.40903 0.999954 11.226C0.999954 13.351 0.991951 13.79 1.27095 13.925C1.42095 13.998 1.98794 14 3.75795 14C5.47397 14 6.10599 13.996 6.22599 13.932C6.30677 13.8842 6.37552 13.8185 6.42699 13.74C6.49799 13.62 6.49999 13.049 6.49999 11.245C6.49999 9.43103 6.49799 8.88 6.42599 8.756C6.27399 8.495 6.31501 8.499 3.73595 8.5C2.11394 8.501 1.36995 8.508 1.26595 8.56ZM8.76599 8.572C8.68977 8.62322 8.62422 8.68878 8.57299 8.765C8.50299 8.88 8.50099 9.44403 8.49999 11.249V13.623L8.58399 13.747C8.75599 14.005 9.21199 14 11.255 14C13.277 14 13.751 14.004 13.924 13.768C13.999 13.667 14 13.129 14 11.245C14 9.36203 13.999 8.833 13.924 8.731C13.751 8.496 13.279 8.499 11.237 8.5C9.45399 8.5 8.88099 8.502 8.76599 8.572ZM5.49199 11.245V13.01H1.98995V9.489H5.49199V11.245ZM12.992 11.246V13.011L11.246 13.002L9.50899 12.992L9.49899 11.236L9.48899 9.489H12.992V11.246Z' />
      <path d='M10.5701 1.24978C10.6387 1.13347 10.7499 1.04845 10.8801 1.01278C10.9812 0.990949 11.0863 0.997173 11.1841 1.03078C11.3151 1.08462 11.4194 1.18819 11.4741 1.31878L11.5011 1.38678L11.5041 2.69078L11.5 3.5L12.2684 3.496C12.7108 3.49144 13.1532 3.49544 13.5954 3.508C13.6746 3.52313 13.749 3.55719 13.8122 3.60729C13.8754 3.65739 13.9256 3.72204 13.9584 3.79572C13.9912 3.8694 14.0057 3.94992 14.0006 4.03042C13.9956 4.11092 13.9711 4.189 13.9294 4.258C13.8795 4.33233 13.8135 4.39452 13.7364 4.44C13.6174 4.501 13.6504 4.5 12.2794 4.5H11.5L11.5071 5.26913C11.5071 6.64013 11.5081 6.61644 11.4471 6.73544C11.4016 6.81257 11.3395 6.87852 11.2651 6.92844C11.1856 6.97629 11.0947 7.00084 11.0028 7C11.0028 7.00931 10.9592 6.99818 10.9375 6.99512C10.8239 6.9791 10.7192 6.92448 10.6411 6.84044C10.6109 6.80878 10.5847 6.77351 10.5631 6.73544C10.5021 6.61644 10.5031 6.64013 10.5031 5.26913L10.496 4.5H9.72126C8.35026 4.5 8.38326 4.501 8.26426 4.44C8.20126 4.408 8.10826 4.32 8.07126 4.258C8.0295 4.189 8.00505 4.11092 8 4.03042C7.99496 3.94992 8.00946 3.8694 8.04227 3.79572C8.07508 3.72204 8.12523 3.65739 8.18844 3.60729C8.25164 3.55719 8.32603 3.52313 8.40526 3.508C8.84747 3.49544 9.28989 3.49144 9.73226 3.496H10.496L10.5031 2.71878C10.5031 1.32878 10.5011 1.37678 10.5701 1.24978Z' />
    </svg>
  )
}

function IconHighlight({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      fill='currentColor'
      viewBox='0 0 15 15'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M14.1806 3.56405C14.4022 3.64062 14.5298 3.87303 14.4869 4.10249L14.4709 4.16488L14.2875 4.72444L12.8098 9.23985C12.5815 9.93263 11.885 10.3275 11.2042 10.177L10.9235 10.7293C10.6902 11.4434 9.8142 12.2942 9.11534 12.1062L9.02442 12.0783L8.87765 12.0277L8.38963 13.5155C8.22992 14.0042 7.82626 14.3842 7.33898 14.4811L7.23335 14.4971L1.01824 14.4955C0.72286 14.4848 0.453418 14.2428 0.512076 13.9351L0.527996 13.8735L1.89138 10.0074L1.74369 9.95659C1.04863 9.7171 0.802068 8.52606 0.985301 7.80809L1.01634 7.70257L1.2969 6.85169C0.694614 6.56527 0.385749 5.87213 0.538865 5.20794L0.567579 5.1084L1.80451 1.29692L1.85179 1.1651L1.94944 0.860412C2.03061 0.612033 2.30371 0.438539 2.56934 0.52057C2.79293 0.589622 2.911 0.833131 2.86825 1.06263L2.85229 1.12503L1.44306 5.41006C1.36865 5.63774 1.47184 5.88265 1.67577 5.98605L1.73383 6.01062L11.3485 9.23544C11.5706 9.31155 11.8096 9.20532 11.9108 8.99618L11.9349 8.93665L13.5956 3.86241C13.677 3.61411 13.9389 3.48053 14.1806 3.56405ZM2.76687 10.3091L8.00216 11.726L7.51414 13.2139L7.49796 13.2566C7.42857 13.3978 7.28703 13.4274 7.13124 13.4458L1.63458 13.468L2.76687 10.3091ZM2.16955 7.16117L10.3255 9.88337L10.048 10.4276L10.0202 10.4994C9.9195 10.7089 9.53999 11.2552 9.31837 11.1789L2.03765 9.05713L1.97959 9.03256C1.77565 8.92916 1.81742 8.23191 1.89183 8.00423L2.16955 7.16117Z'
      />
    </svg>
  )
}

export {
  IconCollection,
  IconHighlight,
  IconAddToCollection,
  IconTag,
  IconIdea,
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
