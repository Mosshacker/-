addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  try {
    // Fetch today's Hukamnama from the API
    const res = await fetch('https://api.gurbaninow.com/v2/hukamnama/today')
    if (!res.ok) throw new Error('Failed to fetch Hukamnama')
    const data = await res.json()

    let output = []

    // Header info
    const date = data.date.gregorian
    const info = data.hukamnamainfo

    output.push(`Hukamnama for ${date.month} ${date.date}, ${date.year} (${date.day})`)
    output.push(`Source: ${info.source.english}, Ang ${info.source.pageName.english}`)
    output.push(`Raag: ${info.raag.english}`)
    output.push(`Writer: ${info.writer.english}`)
    output.push("\n---\n")

    // Process each line
    data.hukamnama.forEach(lineObj => {
      const line = lineObj.line
      const gurmukhi = line.gurmukhi?.unicode || ''
      const transliteration = line.transliteration?.english?.text || ''
      const translation = line.translation?.english?.default || ''

      output.push(`Gurmukhi: ${gurmukhi}`)
      output.push(`Transliteration: ${transliteration}`)
      output.push(`Translation: ${translation}`)
      output.push("\n")
    })

    const plaintext = output.join('\n')
    return new Response(plaintext, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500 })
  }
}
