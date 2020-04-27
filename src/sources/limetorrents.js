const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");
const unhumanizeSize = require("../lib/unhumanizeSize");
const { parse } = require("node-html-parser");

class Limetorrents extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1, category = "all") {
    try {
      const search_query = query.split(" ").join("-");
      const search_url = `${this.url}/search/${category}/${search_query}/${page}/`;
      const torrent_content = [];

      const { data } = await axios.get(search_url);
      const root = parse(data).querySelectorAll(".table2 tr");
      root.shift();

      for (const element of root) {
        const title = element.querySelector(".tdleft").text;
        const torrent_link = element.querySelector(".tt-name a").attributes
          .href;
        const seeds = element.querySelector("td.tdseed").text;
        const leeches = element.querySelector("td.tdleech").text;
        const info = element.querySelectorAll("td.tdnormal");
        const size = info[1].text;

        torrent_content.push({
          fileName: title,
          seeders: Number(seeds.replace(",", "")),
          leechers: Number(leeches.replace(",", "")),
          uploaded: info[0].text.split(" -")[0],
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

module.exports = Limetorrents;
