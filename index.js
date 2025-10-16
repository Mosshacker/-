export default {
  async fetch(request) {
    try {
      const response = await fetch("https://api.gurbaninow.com/v2/hukamnama/today");
      if (!response.ok) {
        return new Response("Failed to fetch Hukamnama.", { status: 500 });
      }

      const data = await response.json();
      const hukamGurmukhi = data.hukamnama.hukamnamaGurmukhi.map(l => l.line).join("\n");
      const hukamEnglish = data.hukamnama.hukamnamaEnglish.map(l => l.line).join("\n");

      const raag = data.hukamnama.meta.raag.english;
      const source = `${data.hukamnama.meta.source.english} (Ang ${data.hukamnama.meta.page})`;

      const fullText = 
`📜 Hukamnama Today
--------------------
Raag: ${raag}
Source: ${source}

🔹 Gurmukhi:
${hukamGurmukhi}

🔹 English Translation:
${hukamEnglish}

— via api.gurbaninow.com`;

      return new Response(fullText, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    } catch (error) {
      return new Response("Error: " + error.message, { status: 500 });
    }
  },
};
