/*jshint esversion: 6 */
const axios = require("axios");

const bytesToSize = bytes => {
  let sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + "" + sizes[i];
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const search = async (query, rarbg_api_url) => {
  let search_query = query.split(" ").join("+");
  let data_content = {};
  let torrent_content = [];

  //get token
  let token_url =
    rarbg_api_url + "/pubapi_v2.php?get_token=get_token&app_id=Torrentflix";

  try {
    const response = await axios.get(token_url, {
      headers: {
        "user-agent": "node.js"
      }
    });

    const search_url =
      rarbg_api_url +
      "/pubapi_v2.php?mode=search&search_string=" +
      encodeURIComponent(search_query) +
      "&app_id=Torrentflix&sort=seeders&format=json_extended&token=" +
      response.data.token;

    await sleep(2200);

    const { data } = await axios.get(search_url, {
      headers: {
        "user-agent": "node.js"
      }
    });

    if (!data.error) {
      for (let torrent in data.torrent_results) {
        let title = data.torrent_results[torrent].title;
        let torrent_link = data.torrent_results[torrent].download;
        let seeds = data.torrent_results[torrent].seeders;
        let leechs = data.torrent_results[torrent].leechers;
        let size = bytesToSize(data.torrent_results[torrent].size);
        let date_added = data.torrent_results[torrent].pubdate.split("+")[0];

        data_content = {
          title: title,
          category: "",
          seeds: seeds,
          leechs: leechs,
          size: size,
          torrent_link: torrent_link,
          date_added: date_added
        };

        torrent_content.push(data_content);
      }
    }
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading Rarbg";
  }
};

module.exports = { search };
