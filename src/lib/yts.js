const axios = require("axios");

const search = async (query, yts_url) => {
  let data_content = {};
  let torrent_content = [];

  //https://yify.unblocked.pw/api/v2/list_movies.json?query_term=guardians&sort=seeds&order=desc&set=1
  //let search_url = yts_url + '/json.php?q=' + encodeURIComponent(query) + '&field=seeders&order=desc&page=' + page;
  let search_url =
    yts_url +
    "/api/v2/list_movies.json?query_term=" +
    encodeURIComponent(query) +
    "&sort=seeds&order=desc&set=1";

  try {
    const { data } = await axios.get(search_url);

    if (data.data.movie_count > 0) {
      for (let torrent in data.data.movies) {
        let title = data.data.movies[torrent].title_long;

        for (let torrents in data.data.movies[torrent].torrents) {
          let torrent_quality =
            data.data.movies[torrent].torrents[torrents].quality;
          let torrent_title = title + " " + torrent_quality;
          let seeds = data.data.movies[torrent].torrents[torrents].seeds;
          let leechs = data.data.movies[torrent].torrents[torrents].peers;
          //let torrent_link = data.data.movies[torrent].torrents[torrents].url;
          let hash = data.data.movies[torrent].torrents[torrents].hash;
          let torrent_link = yts_url + "/torrent/download/" + hash;
          let size = data.data.movies[torrent].torrents[torrents].size;
          let date_added = data.data.movies[torrent].torrents[
            torrents
          ].date_uploaded.split(" ")[0];

          data_content = {
            title: torrent_title,
            seeds: seeds,
            leechs: leechs,
            size: size,
            torrent_link: torrent_link,
            date_added: date_added
          };

          torrent_content.push(data_content);
        }
      }
    }
    return torrent_content;
  } catch (err) {
    throw "\u2717 There was a problem loading YTS";
  }
};

module.exports = { search };
