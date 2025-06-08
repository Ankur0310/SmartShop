const { google } = require("googleapis");
const { fetchTranscript } = require("youtube-transcript");
const summarizeTranscripts = require("./summarizer");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

async function fetchSummaries(query) {
  const res = await youtube.search.list({
    q: query,
    part: "snippet",
    maxResults: 5,
    type: "video",
  });

  const results = [];

  for (const item of res.data.items) {
    const videoId = item.id.videoId;
    const channel = item.snippet.channelTitle;

    try {
      const transcriptData = await fetchTranscript(videoId);
      const fullTranscript = transcriptData.map(t => t.text).join(" ");
      const products = await summarizeTranscripts(fullTranscript);

      products.forEach(product => {
        const existing = results.find(p => p.product === product);
        if (existing) {
          existing.featured_by.push(channel);
        } else {
          results.push({ product, featured_by: [channel] });
        }
      });
    } catch (e) {
      console.log("No transcript for", videoId);
    }
  }

  return results;
}

module.exports = { fetchSummaries };
