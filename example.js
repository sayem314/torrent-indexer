const torrentIndexer = require("./");

(async function() {
  const series = await torrentIndexer.search("rick and morty s04e04", "series");
  console.log("Series", series[0], series.length + " items");

  if (!series[0].link) {
    const torrentInfo = torrentIndexer.info(series[0].site);
  }

  const movies = await torrentIndexer.search(
    "x-men: dark phoenix 2019",
    "movie"
  );

  console.log("Movies", movies[0], movies.length + " items");
})();
