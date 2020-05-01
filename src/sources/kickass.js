const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");
const unhumanizeSize = require("../lib/unhumanizeSize");
const { parse } = require("node-html-parser");

class Kickass extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1) {
    try {
      const search_url = `${
        this.url
      }/katsearch/page/${page}/${encodeURIComponent(query)}`;
      const torrent_content = [];

      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll("tbody tr");

      for (const element of root) {
        const a = element.querySelectorAll("td a");
        const info = element.querySelectorAll("td");
        const size = info[1].text;

        // Sometimes link on position 6 contains ads link
        let link = a[6].attributes.href;
        if (!link.startsWith("magnet:?xt=urn:btih:")) {
          link = a[5].attributes.href;
        }

        torrent_content.push({
          fileName: a[0].text.trim(),
          category: a[2].text,
          seeders: Number(info[4].text),
          leechers: Number(info[5].text),
          uploaded: info[3].text,
          uploader: a[1].text.trim(),
          size,
          length: unhumanizeSize(size),
          link
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

module.exports = Kickass;
