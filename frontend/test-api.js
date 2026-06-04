(async () => {
  try {
    const home = await fetch('http://localhost:3000/api/home').then(r => r.json());
    const id = home.trendingAnimes[0].id;
    console.log("ID:", id);
    const details = await fetch(`http://localhost:3000/api/anime/${id}`).then(r => r.json());
    console.log("Details keys:", Object.keys(details.anime));
    
    const episodes = await fetch(`http://localhost:3000/api/anime/${id}/episodes`).then(r => r.json());
    const ep1 = episodes.episodes[0].episodeId;
    console.log("EP ID:", ep1);
    
    const url = `http://localhost:3000/api/anime/${id}/ep/${encodeURIComponent(ep1)}`;
    console.log("Fetching stream from:", url);
    const stream = await fetch(url).then(r => r.json());
    console.log("Stream:", JSON.stringify(stream, null, 2));
  } catch (e) {
    console.error(e);
  }
})();
