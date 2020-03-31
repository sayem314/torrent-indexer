const TorrentSource = require("./torrentSource");
const axios = require("axios");
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

      const { data } = await axios.get(search_url, {
        headers: {
          "User-Agent": "request"
        },
        timeout: 10000
      });
      const root = parse(data).querySelectorAll("tr.forum_header_border");

      for (const element of root) {
        const title = element.querySelectorAll("a.epinfo")[0].text;
        const torrent_link = element.querySelectorAll("a.magnet")[0].attributes
          .href;
        const seeds = element.querySelectorAll("td.forum_thread_post_end")[0]
          .text;
        const info = element.querySelectorAll("td.forum_thread_post");

        torrent_content.push({
          title,
          category: "",
          seeds: Number(seeds),
          leechs: "",
          date_added: info[4].text,
          size: info[3].text,
          torrent_link
        });
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = Eztv;
