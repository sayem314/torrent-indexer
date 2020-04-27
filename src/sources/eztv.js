const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");
const unhumanizeSize = require("../lib/unhumanizeSize");
const { parse } = require("node-html-parser");

class Eztv extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1) {
    try {
      if (page !== 1) {
        return [];
      }

      const search_query = query.split(" ").join("-");
      const search_url = this.url + "/search/" + search_query;
      const torrent_content = [];

      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll("tr.forum_header_border");

      for (const element of root) {
        const title = element.querySelectorAll("a.epinfo")[0].text;
        const torrent_link = element.querySelectorAll("a.magnet")[0].attributes
          .href;
        const seeds = element.querySelectorAll("td.forum_thread_post_end")[0]
          .text;
        const info = element.querySelectorAll("td.forum_thread_post");
        const size = info[3].text;

        torrent_content.push({
          fileName: title,
          seeders: Number(seeds),
          leechers: 0,
          uploaded: info[4].text,
          size,
          length: unhumanizeSize(size),
          link: torrent_link
        });
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.sourceName);
      console.error(err.message);
      return [];
    }
  }
}

module.exports = Eztv;
