import asciidoctor from '@asciidoctor/core'
import { Code, Text, Snippet, Table, Tree, Note } from '@geist-ui/core'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const Asciidoctor = asciidoctor()

const syntaxHighlighterStyle = {
  ...docco,
  hljs: {
    backgroundColor: 'transparent'
  }
}

class AsciidoctorComponentConverter {
  convert (node, transform) {
    const nodeName = node.getNodeName()
    if (nodeName === 'admonition') {
      return <Note label={node.getAttribute('name')}>{node.hasBlocks() ? node.getBlocks().map(block => block.convert()) : node.getContent()}</Note>
    }
    if (nodeName === 'ulist') {
      if (node.getRoles().includes('filetree') || node.getParent().getContext() === 'list_item') {
        return (
          <Tree>
            {node.getItems().map((item) => {
              const name = item.getText()
              if (item.hasBlocks()) {
                return <Tree.Folder key={name} name={name}>
                  {item.getBlocks().map(block => block.convert())}
                </Tree.Folder>
              } else {
                return <Tree.File key={name} name={name}/>
              }
            })}
          </Tree>
        )
      }
    }
    if (nodeName === 'table') {
      const headRows = node.getHeadRows()
      let columns = {}
      if (headRows) {
        columns = headRows[0].reduce((acc, row, index) => {
          acc[`.${index}`] = row.getText()
          return acc
        }, {})
      } else {
        const columnsCount = node.getColumns().length
        for (let i = 0; i < columnsCount; i++) {
          columns[`.${i}`] = ''
        }
      }
      const bodyRows = node.getBodyRows()
      const data = bodyRows.map((r) => {
        return r.reduce((acc, cell, index) => {
          acc[`.${index}`] = cell.getText()
          return acc
        }, {})
      })

      return (
        <Table data={data}>
          {Object.entries(columns).map(([key, value]) => <Table.Column key={key} prop={key} label={value}/>)}
        </Table>
      )
    }
    if (nodeName === 'paragraph') {
      return <Text p>{node.getContent()}</Text>
    }
    if (nodeName === 'literal') {
      return <Snippet text={node.getContent()} width="300px"/>
    }
    if (nodeName === 'section') {
      return (
        <section>
          <Text h2>{node.getTitle()}</Text>
          {node.getBlocks().map(block => block.convert())}
        </section>
      )
    }
    if (nodeName === 'listing') {
      return <Code block name={node.getTitle()} my={0}>
        <SyntaxHighlighter PreTag="div" showLineNumbers={true} language="javascript" style={syntaxHighlighterStyle}>
          {node.getContent()}
        </SyntaxHighlighter>
      </Code>
    }
    return (<>{node.getBlocks().map(block => block.convert())}</>)
  }
}

Asciidoctor.ConverterFactory.register(new AsciidoctorComponentConverter(), ['component'])
