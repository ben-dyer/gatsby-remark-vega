const visit = require("unist-util-visit")

const escape = txt => txt.replace(/"/g, "&quot;")

const MARKDOWN_TAG = "vega"

module.exports = ({ markdownNode, markdownAST }) => {
  visit(markdownAST, `inlineCode`, node => {
    const { value } = node

    if (value.startsWith(`${MARKDOWN_TAG}:`)) {
      const file = value.split(":").pop()
      const path = markdownNode.fileAbsolutePath.replace(/(?<=\/)[^\/]+$/, file)
      const fs = require(`fs`)
      if (!fs.existsSync(path)) {
        throw Error(`Invalid file specified; no such file "${path}"`)
      }

      const spec = fs.readFileSync(path, `utf8`)

      node.type = `html`
      node.value = `<vega spec="${escape(spec)}" />`
    }
  })

  return markdownAST
}
