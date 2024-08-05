import { ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes, Range } from '@tiptap/core'
import { Image } from '@tiptap/extension-image'

import { ImageViewerComponent } from './ui'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageViewer: {
      setImageViewer: (attributes: { src: string }) => ReturnType
      setImageViewerAt: (attributes: { src: string; pos: number | Range }) => ReturnType
      setImageViewerAlign: (align: 'left' | 'center' | 'right') => ReturnType
      setImageViewerWidth: (width: number) => ReturnType
    }
  }
}

export const ImageViewer = Image.extend({
  name: 'imageViewer',

  group: 'block',
  defining: true,
  isolating: true,

  addAttributes() {
    return {
      src: {
        default: '',
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => ({
          src: attributes.src,
        }),
      },
      width: {
        default: '100%',
        parseHTML: (element) => element.getAttribute('data-width'),
        renderHTML: (attributes) => ({
          'data-width': attributes.width,
        }),
      },
      align: {
        default: 'center',
        parseHTML: (element) => element.getAttribute('data-align'),
        renderHTML: (attributes) => ({
          'data-align': attributes.align,
        }),
      },
      alt: {
        default: undefined,
        parseHTML: (element) => element.getAttribute('alt'),
        renderHTML: (attributes) => ({
          alt: attributes.alt,
        }),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src*="tiptap.dev"]:not([src^="data:"]), img[src*="windows.net"]:not([src^="data:"])',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)]
  },

  addCommands() {
    return {
      setImageViewer:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({
            type: 'imageViewer',
            attrs: { src: attrs.src },
          })
        },

      setImageViewerAt:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContentAt(attrs.pos, {
            type: 'imageViewer',
            attrs: { src: attrs.src },
          })
        },

      setImageViewerAlign:
        (align) =>
        ({ commands }) =>
          commands.updateAttributes('imageViewer', { align }),

      setImageViewerWidth:
        (width) =>
        ({ commands }) =>
          commands.updateAttributes('imageViewer', {
            width: `${Math.max(0, Math.min(100, width))}%`,
          }),
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewerComponent)
  },
})

export default ImageViewer
