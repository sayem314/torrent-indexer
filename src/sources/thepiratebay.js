const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");
const unhumanizeSize = require("../lib/unhumanizeSize");
const { parse } = require("node-html-parser");

class ThePirateBay extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1) {
    try {
      const search_url = `${this.url}/search/${encodeURIComponent(
        query
      )}/${page - 1}/7/0`;
      const torrent_content = [];

      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll("tr");
      root.shift();
      root.pop();

      for (const element of root) {
        const a = element.querySelectorAll("a");
        const info = element.querySelectorAll("td");
        const more = element.querySelectorAll(".detDesc")[0].text.split(" ");
        const size = more[3].replace(",", "");

        torrent_content.push({
          fileName: a[2].text,
          seeders: Number(info[2].text),
          leechers: Number(info[3].text),
          uploaded: more[1]
            .split(" ")
            .join("-")
            .replace(",", ""),
          uploader: more[7],
          size,
          length: unhumanizeSize(size),
          link: a[3].attributes.href
        });
      }

      return super.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.sourceName);
      console.error(err.message);
      return [];
    }
  }
}

module.exports = ThePirateBay;
