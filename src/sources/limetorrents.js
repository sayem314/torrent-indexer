const TorrentSource = require("../lib/torrentSource");
const axios = require("axios");
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

      const { data } = await axios.get(search_url, { timeout: 10000 });
      const root = parse(data).querySelectorAll(".table2 tr");
      root.shift();

      for (const element of root) {
        const title = element.querySelector(".tdleft").text;
        const torrent_link = element.querySelector(".tt-name a").attributes
          .href;
        const seeds = element.querySelector("td.tdseed").text;
        const leeches = element.querySelector("td.tdleech").text;
        const info = element.querySelectorAll("td.tdnormal");

        torrent_content.push({
          fileName: title,
          seeders: Number(seeds.replace(",", "")),
          leechers: Number(leeches.replace(",", "")),
          uploaded: info[0].text.split(" -")[0],
          size: info[1].text,
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
