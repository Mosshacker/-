export default {
  async fetch(request, env, ctx) {
    try {
      const apiResponse = await fetch("https://api.gurbaninow.com/v2/hukamnama/today");
      const data = await apiResponse.json();

      // Destructure safely
      const hukam = data.hukamnama || {};
      const date = hukam.date || "Unknown Date";
      const raag = hukam.raag || "Unknown Raag";
      const source = hukam.source || "Unknown Source";
      const ang = hukam.ang || "?";
      const gurmukhi = hukam.gurmukhi || "No Gurmukhi text available.";
      const english = hukam.english || "No English translation available.";

      // Create formatted text
      const output = `
📜 Hukamnama Today
--------------------
Date: ${date}
Ang: ${ang}
Raag: ${raag}
Source: ${source}

🔹 Gurmukhi:
${gurmukhi}

🔹 English Translation:
${english}
`;

      return new Response(output, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });

    } catch (err) {
      return new Response("Error fetching Hukamnama: " + err.message, { status: 500 });
    }
  },
};
