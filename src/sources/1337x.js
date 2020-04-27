const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");
const unhumanizeSize = require("../lib/unhumanizeSize");
const { parse } = require("node-html-parser");

class Leetx extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1, category) {
    try {
      const search_query = query.split(" ").join("+");
      const search_url = `${this.url}/${
        category ? "category-search" : "search"
      }/${search_query}/${category ? category + "/" : "/"}${page}/`;
      const torrent_content = [];

      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll(".table-list tbody tr");

      for (const element of root) {
        const a = element.querySelectorAll(".name a")[1];
        const seeds = element.querySelectorAll(".seeds")[0].text;
        const leeches = element.querySelectorAll(".leeches")[0].text;
        const size = element.querySelectorAll("td.coll-4")[0].childNodes[0]
          .text;
        const date_added = element.querySelectorAll("td.coll-date")[0].text;
        const uploader = element.querySelectorAll("td.coll-5")[0].text;

        torrent_content.push({
          fileName: a.text.replace("⭐", "").trim(),
          seeders: Number(seeds),
          leechers: Number(leeches),
          uploaded: date_added,
          uploader,
          size,
          length: unhumanizeSize(size),
          site: this.url + a.attributes.href
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

module.exports = Leetx;
