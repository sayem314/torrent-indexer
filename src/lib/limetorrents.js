const axios = require("axios");
const cheerio = require("cheerio");

const search = async (query, limetorrents_url, page, category) => {
  let search_query = query.split(" ").join("-");
  let search_url = `${limetorrents_url}/search/${category}/${search_query}/${page}/`;
  let data_content = {};
  let torrent_content = [];

  try {
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const $ = cheerio.load(data);

    $(".table2 tr").each((index, torrents) => {
      if (
        $(torrents)
          .find(".tt-name a.csprite_dl14")
          .attr("href")
      ) {
        let find_torrent_link = $(torrents).find(".tt-name a.csprite_dl14");
        let find_torrent_title = $(torrents).find(".tt-name a");
        let find_torrent_size = $(torrents).find("td.tdnormal");
        let find_torrent_seeders = $(torrents).find("td.tdseed");
        let find_torrent_leechers = $(torrents).find("td.tdleech");
        let find_date_added = $(torrents).find("td.tdnormal");

        let torrent_link = find_torrent_link.attr("href");
        let torrent_name = find_torrent_title.text();
        let torrent_size = find_torrent_size
          .next()
          .first()
          .text();
        let torrent_seed = find_torrent_seeders.text();
        let torrent_leech = find_torrent_leechers.text();
        let date_added = find_date_added
          .first()
          .text()
          .split(" -")[0];

        data_content = {
          title: torrent_name,
          category: "",
          seeds: Number(torrent_seed.replace(",", "")),
          leechs: Number(torrent_leech.replace(",", "")),
          size: torrent_size,
          torrent_link: torrent_link,
          date_added: date_added
        };

        torrent_content.push(data_content);
      }
    });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Limetorrents";
  }
};

module.exports = { search };
