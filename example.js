/* eslint-disable */
const TorrentIndexer = require("./");
const torrentIndexer = new TorrentIndexer();

(async function() {
  // search tv series
  const series = await torrentIndexer.search("rick and morty s04e04", "series");
  console.log("Series", series[0], series.length + " items");

  // link contains magnet, infohash or torrent
  if (!series[0].link) {
    const torrentInfo = torrentIndexer.torrent(series[0].site);
    // returns magnet or infohash
  }

  // search movies
  const movies = await torrentIndexer.search(
    "x-men: dark phoenix 2019",
    "movie"
  );
  console.log("Movies", movies[0], movies.length + " items");

  // search anime
  const anime = await torrentIndexer.search("ride your wave", "anime");
  console.log("Anime", anime[0], anime.length + " items");

  // search music or other thing
  const music = await torrentIndexer.search("lana del rey");
  console.log("Music", music[0], music.length + " items");
})();
