const axios = require("axios");
const cheerio = require("cheerio");

const search = async (query, leetx_url, page) => {
  let search_query = query.split(" ").join("+");
  let search_url = `${leetx_url}/search/${search_query}/${page}/`;
  let data_content = {};
  let torrent_content = [];

  try {
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const $ = cheerio.load(data);

    $(".table-list tbody tr").each((index, torrents) => {
      let torrent_site = $(torrents)
        .find(".name a")
        .next()
        .attr("href");
      let title = $(torrents)
        .find(".name a")
        .text()
        .replace("⭐", "")
        .trim();
      let seeds = $(torrents)
        .find(".seeds")
        .eq(0)
        .text();

      let leechs = $(torrents)
        .find(".leeches")
        .eq(0)
        .text();

      let size = $(torrents)
        .find("td.coll-4")
        .children()
        .remove()
        .end()
        .text();
      let date_added = $(torrents)
        .find(".coll-date")
        .text();

      data_content = {
        title: title,
        category: "",
        seeds: Number(seeds),
        leechs: Number(leechs),
        size: size,
        torrent_site: leetx_url + torrent_site,
        date_added: date_added
      };

      torrent_content.push(data_content);
    });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading 1337x";
  }
};

module.exports = { search };
