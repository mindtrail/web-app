export const formatChunkForEmbedding = (chunk: string): string => {
  return chunk
    .replace(/(?<!\n)\n(?!\n)/g, ' ') // Replace single newlines with spaces
    .replace(/\s?-\s?/g, '-') // Fix spacing around dashes
    .replace(/\.+/g, '.') // remove two consecutive periods
    .replace(/ \./g, '.') // Remove spaces before periods
    .replace(/\.(?=[a-zA-Z0-9])/g, '. ') // Ensure space after a period
    .replace(/[‘’]/g, "'") // Normalize curly quotes to straight quotes
    .replace(/[“”]/g, '"') // Normalize curly quotes to straight quotes
    .replace(/ ' /g, "'") // Remove extra spaces around single straight quotes
    .replace(/\s{2,}/g, ' ') // Replace multiple whitespace characters with a single space
    .toLowerCase() // Convert to lowercase
    .replace(
      /(?<=[\.!?]\s)([a-z])|^(?<start>[a-z])/g,
      (match, group1, start) => {
        if (group1) {
          return group1.toUpperCase()
        } else if (start) {
          return start.toUpperCase()
        }
        return match
      },
    ) // Capitalize first letter of each sentence
    .trim()
}

export const ANCHORS_WITH_SIBINGS = 'a:has(a)'
export const HTML_TAGS_TO_EXCLUDE =
  'nav, header, footer, aside, menu, menuitem, .nav, .header, .footer, .aside, .menu, .menuitem, .navigation, .navBar, .nav-bar, .navbar, .sidebar, .topnav, .bottomnav, .breadcrumb, .pagination, .dropdown, .pageFooter, .footer, .sidenav, .main-menu, .submenu, .widget, script, style, noscript, iframe, link[rel="alternate svg image"], code, meta'
