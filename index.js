export default {
  async fetch(request) {
    try {
      const response = await fetch("https://api.gurbaninow.com/v2/hukamnama/today");
      if (!response.ok) {
        return new Response("Failed to fetch Hukamnama.", { status: 500 });
      }

      const data = await response.json();

      // Defensive checks
      const gurmukhiLines = data?.hukamnama?.hukamnamaGurmukhi || [];
      const englishLines = data?.hukamnama?.hukamnamaEnglish || [];

      const hukamGurmukhi = gurmukhiLines.map(l => l.line).join("\n") || "No Gurmukhi text available.";
      const hukamEnglish = englishLines.map(l => l.line).join("\n") || "No English translation available.";

      const raag = data?.hukamnama?.meta?.raag?.english || "Unknown Raag";
      const sourceMeta = data?.hukamnama?.meta?.source?.english || "Unknown Source";
      const page = data?.hukamnama?.meta?.page || "?";
      const source = `${sourceMeta} (Ang ${page})`;

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
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    } catch (error) {
      return new Response("Error: " + error.message, { status: 500 });
    }
  },
};
