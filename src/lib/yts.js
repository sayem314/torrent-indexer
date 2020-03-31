const TorrentSource = require("./torrentSource");
const axios = require("axios");

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
      const { data } = await axios.get(search_url, { timeout: 10000 });

      if (data.data.movie_count > 0) {
        for (let torrent in data.data.movies) {
          let title = data.data.movies[torrent].title_long;

          for (let torrents in data.data.movies[torrent].torrents) {
            let torrent_quality =
              data.data.movies[torrent].torrents[torrents].quality;
            let torrent_title = title + " " + torrent_quality;
            let seeds = data.data.movies[torrent].torrents[torrents].seeds;
            let leechs = data.data.movies[torrent].torrents[torrents].peers;
            //let torrent_link = data.data.movies[torrent].torrents[torrents].url;
            let hash = data.data.movies[torrent].torrents[torrents].hash;
            let torrent_link = this.url + "/torrent/download/" + hash;
            let size = data.data.movies[torrent].torrents[torrents].size;
            let date_added = data.data.movies[torrent].torrents[
              torrents
            ].date_uploaded.split(" ")[0];

            torrent_content.push({
              title: torrent_title,
              seeds: seeds,
              leechs: leechs,
              size: size,
              torrent_link: torrent_link,
              date_added: date_added
            });
          }
        }
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = Yts;
