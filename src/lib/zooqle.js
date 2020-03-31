const TorrentSource = require("./torrentSource");
const axios = require("axios");
const { parse } = require("node-html-parser");

const nonHumanizeNumbers = value => {
  if (value.endsWith("K")) {
    value = parseInt(value) + "000";
  }
  return Number(value);
};

class Zooqle extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1, category) {
    try {
      const search_query = query.split(" ").join("+");
      const search_url = `${this.url}/search/?pg=${page}&q=${search_query}&s=ns&v=t&sd=d`;
      const torrent_content = [];

      const { data } = await axios.get(search_url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36"
        },
        timeout: 10000
      });
      const root = parse(data).querySelectorAll("table.table-torrents tr");
      root.shift();

      for (const element of root) {
        const a = element.querySelectorAll("a");
        const seeds = element.querySelectorAll("div.prog-green")[0];
        const leechs = element.querySelectorAll("div.prog-yellow")[0];
        const size = element.querySelectorAll("div.prog-blue")[0];
        const date_added = element.querySelectorAll(
          "td.text-nowrap.text-muted.smaller"
        )[0].text;

        if (seeds && leechs && size) {
          torrent_content.push({
            fileName: a[0].text,
            seeders: nonHumanizeNumbers(seeds.text),
            leechers: nonHumanizeNumbers(leechs.text),
            uploaded: date_added,
            size: size.text,
            link: a[2].attributes.href
          });
        }
      }

      if (category) {
        query += " category%3A" + category;
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.sourceName);
      console.error(err.message);
      return [];
    }
  }
}

module.exports = Zooqle;
