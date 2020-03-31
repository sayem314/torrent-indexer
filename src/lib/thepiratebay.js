const TorrentSource = require("./torrentSource");
const axios = require("axios");
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

      const { data } = await axios.get(search_url, { timeout: 10000 });
      const root = parse(data).querySelectorAll("tr");
      root.shift();
      root.pop();

      for (const element of root) {
        const a = element.querySelectorAll("a");
        const info = element.querySelectorAll("td");
        const more = element.querySelectorAll(".detDesc")[0].text.split(" ");

        torrent_content.push({
          title: a[2].text,
          category: "",
          seeds: Number(info[2].text),
          leechs: Number(info[3].text),
          date_added: more[1]
            .split(" ")
            .join("-")
            .replace(",", ""),
          size: more[3].replace(",", ""),
          torrent_link: a[3].attributes.href
        });
      }

      return super.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.name);
      console.error(err.message);
      return [];
    }
  }
}

module.exports = ThePirateBay;
