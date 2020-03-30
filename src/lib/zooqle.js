const axios = require("axios");
const { parse } = require("node-html-parser");

const nonHumanizeNumbers = value => {
  if (value.endsWith("K")) {
    value = parseInt(value) + "000";
  }
  return Number(value);
};

const search = async (query, zooqle_url, page) => {
  const search_query = query.split(" ").join("+");
  const search_url = `${zooqle_url}/search/?pg=${page}&q=${search_query}&s=ns&v=t&sd=d`;

  try {
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
      const seeds = element.querySelectorAll("div.prog-green")[0].text;
      const leechs = element.querySelectorAll("div.prog-yellow")[0].text;
      const size = element.querySelectorAll("div.prog-blue")[0].text;
      const date_added = element.querySelectorAll(
        "td.text-nowrap.text-muted.smaller"
      )[0].text;

      torrent_content.push({
        title: a[0].text,
        category: "",
        seeds: nonHumanizeNumbers(seeds),
        leechs: nonHumanizeNumbers(leechs),
        date_added,
        size,
        torrent_link: a[2].attributes.href
      });
    }

    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Zooqle";
  }
};

module.exports = { search };
