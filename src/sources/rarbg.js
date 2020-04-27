const TorrentSource = require("../lib/torrentSource");
const axios = require("../lib/request");

const bytesToSize = bytes => {
  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + "" + sizes[i];
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

let rarbg_token = { token: null, updated: 0 };

class Rarbg extends TorrentSource {
  constructor(options) {
    super(options.name);
    this.url = options.url;
  }

  async search(query, type, page = 1, category) {
    try {
      if (page !== 1) {
        return [];
      }

      const search_query = query.split(" ").join("+");
      const torrent_content = [];

      // get token
      const seconds = Math.floor(Date.now() / 1000);
      if (seconds - rarbg_token.updated > 870) {
        const token_url =
          this.url + "/pubapi_v2.php?get_token=get_token&app_id=torrenter";
        const response = await axios.get(token_url, {
          headers: {
            "user-agent": "node.js"
          },
          timeout: 10000
        });
        rarbg_token = { token: response.data.token, updated: seconds };
      }

      // docs - https://torrentapi.org/apidocs_v2.txt?&app_id=torrenter
      const search_url = `${
        this.url
      }/pubapi_v2.php?mode=search&search_string=${encodeURIComponent(
        search_query
      )}&app_id=torrenter${
        category ? "&category=" + category : ""
      }&sort=seeders&min_seeders=1&ranked=0&format=json_extended&token=${
        rarbg_token.token
      }`;

      await sleep(2200);

      const { data } = await axios.get(search_url);

      if (!data.error) {
        for (const torrent of data.torrent_results) {
          torrent_content.push({
            fileName: torrent.title,
            category: torrent.category,
            seeders: torrent.seeders,
            leechers: torrent.leechers,
            size: bytesToSize(torrent.size),
            length: torrent.size,
            uploaded: torrent.pubdate.split("+")[0],
            link: torrent.download
          });
        }
      }

      return this.reconstitute(torrent_content, query, type);
    } catch (err) {
      console.log("\u2717 There was a problem loading " + this.sourceName);
      console.error(err.message);
      return [];
    }
  }
}

module.exports = Rarbg;
