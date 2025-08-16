export default async function handler(request, response) {
  const imdbId = request.query.id;
  const season = request.query.s;
  const episode = request.query.e;

  if (!imdbId || !season || !episode) {
    return response.status(400).json({ error: "IMDb ID, temporada e episódio são necessários." });
  }

  const streamId = `${imdbId}:${season}:${episode}`;
  
  const STREAM_API_URLS = [
    "https://baby-beamup.club/stream/series",
    "https://da5f663b4690-skyflixfork.baby-beamup.club/stream/series",
  ];

  for (const baseUrl of STREAM_API_URLS) {
    const fullUrl = `${baseUrl}/${streamId}.json`;
    try {
      const streamResponse = await fetch(fullUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (streamResponse.ok) {
        const data = await streamResponse.json();
        if (data.streams && data.streams.length > 0) {
          return response.status(200).json(data);
        }
      }
    } catch (e) { /* Ignora o erro e tenta a próxima URL */ }
  }

  return response.status(200).json({ streams: [], error: "Nenhum stream disponível" });
}