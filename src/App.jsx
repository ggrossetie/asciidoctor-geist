import { useState, useEffect } from 'react'
import { GeistProvider, CssBaseline, Button } from '@geist-ui/core'
import { Moon, Sun } from '@geist-ui/icons'
import asciidoctor from '@asciidoctor/core'
import './Converter'
import './App.css'

const Asciidoctor = asciidoctor()

function App () {
  const [themeType, setThemeType] = useState('light')
  const [input, setInput] = useState('')

  if (import.meta.hot) {
    import.meta.hot.on('asciidoc-update', (data) => {
      fetchData()
    })
  }

  async function fetchData () {
    const result = await fetch('./doc.adoc')
    setInput(await result.text())
  }

  useEffect(() => {
    fetchData()
  }, [])

  const content = Asciidoctor.convert(input, { standalone: false, backend: 'component' })

  const switchThemes = () => {
    setThemeType(last => (last === 'dark' ? 'light' : 'dark'))
  }

  const Document = () => content
  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline/>
      <Button iconRight={themeType === 'light' ? <Sun/> : <Moon/>} auto scale={2 / 3} onClick={() => switchThemes()}/>
      <div className="App">
        <Document/>
      </div>
    </GeistProvider>
  )
}

export default App
