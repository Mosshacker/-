export default {
  async fetch(request, env, ctx) {
    try {
      const response = await fetch("https://api.gurbaninow.com/v2/hukamnama/today");
      if (!response.ok) {
        return new Response("Failed to fetch Hukamnama.", { status: 500 });
      }

      const data = await response.json();

      // 👇 Add this line to log the entire response to Cloudflare logs
      console.log(JSON.stringify(data, null, 2));

      // (Rest of your code can stay the same)
      const hukam = Array.isArray(data.hukamnama)
        ? data.hukamnama[0]
        : data.hukamnama;

      const gurmukhiLines = hukam?.hukamnamaGurmukhi || [];
      const englishLines = hukam?.hukamnamaEnglish || [];

      const hukamGurmukhi = gurmukhiLines.map(l => l.line).join("\n") || "No Gurmukhi text available.";
      const hukamEnglish = englishLines.map(l => l.line).join("\n") || "No English translation available.";

      const raag = hukam?.meta?.raag?.english || "Unknown Raag";
      const sourceMeta = hukam?.meta?.source?.english || "Unknown Source";
      const page = hukam?.meta?.page || "?";
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
