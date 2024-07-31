// import { Mention } from '@tiptap/extension-mention'
// import { ReactRenderer } from '@tiptap/react'
// import tippy from 'tippy.js'

// // You'll need to create this component
// import MentionList from './MentionList'

// export const Connect = Mention.configure({
//   HTMLAttributes: {
//     class: 'mention',
//   },
//   suggestion: {
//     items: ({ query }) => {
//       // This is where you'd fetch your list of connections
//       return [
//         'Web',
//         'https://tiptap.dev/docs/editor/extensions/nodes/mention',
//         // ... other connections
//       ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
//     },
//     render: () => {
//       let component
//       let popup

//       return {
//         onStart: props => {
//           component = new ReactRenderer(MentionList, {
//             props,
//             editor: props.editor,
//           })

//           popup = tippy('body', {
//             getReferenceClientRect: props.clientRect,
//             appendTo: () => document.body,
//             content: component.element,
//             showOnCreate: true,
//             interactive: true,
//             trigger: 'manual',
//             placement: 'bottom-start',
//           })
//         },
//         onUpdate(props) {
//           component.updateProps(props)

//           popup[0].setProps({
//             getReferenceClientRect: props.clientRect,
//           })
//         },
//         onKeyDown(props) {
//           if (props.event.key === 'Escape') {
//             popup[0].hide()
//             return true
//           }

//           return component.ref?.onKeyDown(props)
//         },
//         onExit() {
//           popup[0].destroy()
//           component.destroy()
//         },
//       }
//     },
//   },
// })
