const TorrentSource = require("./torrentSource");
const axios = require("axios");
const { parse } = require("node-html-parser");

class Sky extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1, category) {
    try {
      const search_query = query.split(" ").join("+");
      const search_url = `${this.url}/?query=${encodeURIComponent(
        search_query
      )}${category ? "&category=" + category : ""}&page=${page}`;

      const torrent_content = [];
      const { data } = await axios.get(search_url, { timeout: 10000 });
      const root = parse(data).querySelectorAll(
        "table.table.is-striped.is-narrow tr"
      );
      root.shift();

      for (const element of root) {
        const a = element.querySelectorAll("td a");
        const info = element.querySelectorAll("td");

        torrent_content.push({
          title: a[0].text,
          category: "",
          seeds: Number(info[4].text),
          leechs: Number(info[5].text),
          date_added: info[3].text,
          size: info[1].text,
          torrent_link: a[2].attributes.href
        });
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

module.exports = Sky;
