const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");

class Yts extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1) {
    try {
      if (page !== 1) {
        return [];
      }

      //https://yify.unblocked.pw/api/v2/list_movies.json?query_term=guardians&sort=seeds&order=desc&set=1
      //let search_url = this.url + '/json.php?q=' + encodeURIComponent(query) + '&field=seeders&order=desc&page=' + page;
      const search_url =
        this.url +
        "/api/v2/list_movies.json?query_term=" +
        encodeURIComponent(query) +
        "&sort=seeds&order=desc&set=1";
      const torrent_content = [];
      const response = await axios.get(search_url);
      const { movie_count, movies } = response.data.data;

      if (movie_count > 0) {
        for (const item of movies) {
          const title = item.title_long;

          for (const torrent of item.torrents) {
            const torrent_link = this.url + "/torrent/download/" + torrent.hash;

            torrent_content.push({
              fileName: title + " " + torrent.quality,
              seeders: torrent.seeds,
              leechers: torrent.peers,
              size: torrent.size,
              length: torrent.size_bytes,
              uploaded: torrent.date_uploaded.split(" ")[0],
              link: torrent_link
            });
          }
        }
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.sourceName);
      console.error(err.message);
      return [];
    }
  }
}

module.exports = Yts;
