const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");
const unhumanizeSize = require("../lib/unhumanizeSize");
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
      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll(
        "table.table.is-striped.is-narrow tr"
      );
      root.shift();

      for (const element of root) {
        const a = element.querySelectorAll("td a");
        const info = element.querySelectorAll("td");
        const size = info[1].text;

        torrent_content.push({
          fileName: a[0].text,
          category: a[4] ? a[4].text : "",
          seeders: Number(info[4].text),
          leechers: Number(info[5].text),
          uploaded: info[3].text,
          size,
          length: unhumanizeSize(size),
          link: a[2].attributes.href
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

module.exports = Sky;
