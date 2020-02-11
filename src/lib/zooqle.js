const axios = require("axios");
const cheerio = require("cheerio");

const nonHumanizeNumbers = value => {
  if (value.endsWith("K")) {
    value = parseInt(value) + "000";
  }
  return Number(value);
};

const search = async (query, zooqle_url, page, category) => {
  let data_content = {};
  let torrent_content = [];
  let search_query = query.split(" ").join("+");
  let search_url = `${zooqle_url}/search/?pg=${page}&q=${search_query}&s=ns&v=t&sd=d`;

  try {
    const { data } = await axios.get(search_url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.79 Safari/537.36"
      },
      timeout: 10000
    });
    const $ = cheerio.load(data);

    // console.log(body);
    $("table.table-torrents tr").each((index, torrents) => {
      let torrent_title, torrent_link;

      let find_torrent_title = $(torrents).find("a.small");

      torrent_title = find_torrent_title.text();
      if (torrent_title) {
        let find_torrent_size = $(torrents).find("div.prog-blue");
        let find_torrent_seeders = $(torrents).find("div.prog-green");

        let find_torrent_leechers = $(torrents).find("div.prog-yellow");

        let find_date_added = $(torrents).find(
          "td.text-nowrap.text-muted.smaller"
        );

        let links = $(torrents).find("a");
        $(links).each((i, link) => {
          if (
            $(link)
              .attr("href")
              .indexOf("magnet:?xt=urn:") > -1 &&
            $(link).attr("href") !== null
          ) {
            torrent_link = $(link).attr("href");
          }
        });

        let torrent_size = find_torrent_size.text();
        let torrent_seed = find_torrent_seeders.text();
        let torrent_leech = find_torrent_leechers.text();
        let date_added = find_date_added.text();

        data_content = {
          title: torrent_title,
          category: "",
          seeds: nonHumanizeNumbers(torrent_seed),
          leechs: nonHumanizeNumbers(torrent_leech),
          size: torrent_size,
          torrent_link: torrent_link,
          date_added: date_added
        };

        torrent_content.push(data_content);
      }
    });
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Zooqle";
  }
};

module.exports = { search };
