import { Editor } from '@tiptap/react'

export const getRenderContainer = (editor: Editor, nodeType: string) => {
  const selection = editor.view.state.selection

  const node1 = editor.view.domAtPos(selection.from)
  console.log(444, node1.node)
  return node1.node
  let node = selection
  let container: HTMLElement | null = node

  while (container && container.nodeType !== Node.ELEMENT_NODE) {
    container = container.parentElement
  }

  while (
    container &&
    !(
      container.getAttribute('data-type') === nodeType ||
      container.classList.contains(nodeType)
    )
  ) {
    container = container.parentElement
  }

  return container
}

export default getRenderContainer
