const axios = require("axios");
const { parse } = require("node-html-parser");

const search = async (query, torrentproject_url, page) => {
  const search_query = query.split(" ").join("+");
  const search_url = `${torrentproject_url}/?t=${search_query}&p=${page - 1}/`;

  try {
    const torrent_content = [];
    const { data } = await axios.get(search_url, { timeout: 10000 });
    const root = parse(data).querySelectorAll("div");

    for (const element of root) {
      const info = element.querySelectorAll("span");

      if (info.length === 6 || info.length === 7) {
        const title = info[0].text.replace("⭐", "").trim();
        const torrent_link = element.querySelectorAll("a")[0].attributes.href;
        const torrent_verified = element.querySelectorAll(".v").length === 1;
        if (torrent_verified) {
          info.shift();
        }

        torrent_content.push({
          title,
          category: "",
          seeds: Number(info[2].text),
          leechs: Number(info[3].text),
          date_added: info[4].text,
          size: info[5].text,
          torrent_verified,
          torrent_link: torrentproject_url + torrent_link
        });
      }
    }

    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading TorrentProject";
  }
};

module.exports = { search };
