/* eslint-disable */
const TorrentIndexer = require("./");
const torrentIndexer = new TorrentIndexer();

(async function() {
  // search tv series
  const series = await torrentIndexer.search("rick and morty s04e04", "series");
  console.log("Series", series[0]); // show first result

  // search movies
  const movies = await torrentIndexer.search("the dark knight 2008", "movie");
  console.log("Movies", movies[0]); // show first result

  // search anime
  const anime = await torrentIndexer.search("ride your wave", "anime");
  console.log("Anime", anime[0]); // show first result

  // search music
  const music = await torrentIndexer.search("lana del rey", "music");
  console.log("Music", music[0]); // show first result

  // search other thing in page 2
  const torrents = await torrentIndexer.search("ubuntu", null, 2);
  console.log("Other", torrents[0]); // show first result
})();
