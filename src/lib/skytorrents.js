const axios = require("axios");
const cheerio = require("cheerio");

const search = async (query, skytorrents_url, page) => {
  let torrent_search = query;
  let search_query = torrent_search.split(" ").join("+");

  let search_url = `${skytorrents_url}/?query=${encodeURIComponent(
    search_query
  )}&page=${page}`;
  let data_content = {};
  let torrent_content = [];

  try {
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const $ = cheerio.load(data);

    $("table.table.is-striped.is-narrow tr").each((index, torrents) => {
      let torrent_title, torrent_link;

      if (
        $(torrents)
          .find("a")
          .text()
      ) {
        let find_torrent_title = $(torrents).find("td a");
        let find_torrent_seed = $(torrents)
          .find("td")
          .next()
          .next()
          .next()
          .next();
        let find_torrent_leech = $(torrents)
          .find("td")
          .next()
          .next()
          .next()
          .next()
          .next();
        let find_torrent_size = $(torrents).find("td.is-hidden-touch");
        let find_torrent_date = $(torrents)
          .find("td.is-hidden-touch")
          .next()
          .next();

        torrent_title = find_torrent_title.first().text();
        let torrent_leech = find_torrent_leech.first().text();
        let torrent_seed = find_torrent_seed.first().text();
        let torrent_size = find_torrent_size.first().text();
        let date_added = find_torrent_date.first().text();

        let links = $(torrents).find("td a");

        $(links).each((i, link) => {
          if (
            $(link)
              .attr("href")
              .indexOf("magnet:?xt=urn:") > -1
          ) {
            torrent_link = $(link).attr("href");
          }
        });

        data_content = {
          title: torrent_title,
          category: "",
          seeds: Number(torrent_seed),
          leechs: Number(torrent_leech),
          size: torrent_size,
          torrent_link: torrent_link,
          date_added: date_added
        };

        torrent_content.push(data_content);
      }
    });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Sky Torrents";
  }
};

module.exports = { search };
