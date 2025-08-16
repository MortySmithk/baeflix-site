export default async function handler(request, response) {
  const tmdbId = request.query.id;
  if (!tmdbId) {
    return response.status(400).json({ error: "TMDB ID é necessário." });
  }

  const TMDB_API_KEY = "cf64e357f3a003e17687bb93cb692d6e";

  try {
    const tmdbResponse = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`);
    const ids = await tmdbResponse.json();
    const imdbId = ids.imdb_id;

    if (!imdbId) {
      throw new Error(`IMDb ID não encontrado para TMDB ID: ${tmdbId}`);
    }

    const STREAM_API_URLS = [
      "https://baby-beamup.club/stream/movie",
      "https://da5f663b4690-skyflixfork.baby-beamup.club/stream/movie",
    ];

    for (const baseUrl of STREAM_API_URLS) {
      const fullUrl = `${baseUrl}/${imdbId}.json`;
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
    
    throw new Error("Nenhum stream encontrado.");

  } catch (error) {
    return response.status(200).json({ streams: [], error: error.message });
  }
}