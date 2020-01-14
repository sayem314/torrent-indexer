const axios = require("axios");
const cheerio = require("cheerio");

const search = async (query, torrentz2_url, page) => {
  let search_url = `${torrentz2_url}/verifiedN?f=${encodeURIComponent(
    query
  )}&p=${page - 1}/`;
  let data_content = {};
  let torrent_content = [];

  try {
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const $ = cheerio.load(data);

    $("div.results > dl").each((index, torrents) => {
      let elem = $(torrents).find("span");

      let torrent_link = $(torrents)
        .find("a")
        .attr("href");

      if (torrent_link) {
        let title = $(torrents)
          .find("a")
          .text();

        let seeds = elem.eq(3).text();
        let leechs = elem.eq(4).text();

        let size = elem.eq(2).text();
        let date_added = elem.eq(1).text();

        data_content = {
          title: title,
          category: "",
          seeds: Number(seeds.replace(",", "")),
          leechs: Number(leechs),
          size: size,
          torrent_verified: true,
          torrent_link: torrent_link.replace("/", ""),
          date_added: date_added
        };

        torrent_content.push(data_content);
      }
    });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Torrentz2";
  }
};

module.exports = { search };
