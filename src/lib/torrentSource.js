const ptt = require("parse-torrent-title");
const { compareTwoStrings } = require("string-similarity");

// score
ptt.addHandler("score", /\b(BRRip|Blu-?ray)\b/i, { value: 29 });
ptt.addHandler("score", /\bBDRip\b/i, { value: 28 });
ptt.addHandler("score", /\bDVDRip\b/i, { value: 27 });
ptt.addHandler("score", /\bDVD(?:R[0-9])?\b/i, { value: 26 });

ptt.addHandler("score", /\bWEB-?DL\b/i, { value: 25 });
ptt.addHandler("score", /\bWEB-?Rip\b/i, { value: 24 });
ptt.addHandler("score", /HDTV/i, { value: 23 });
ptt.addHandler("score", /\bPPVRip\b/i, { value: 22 });
ptt.addHandler("score", /\bTC\b/, { value: 21 });

ptt.addHandler("score", /\bHD-?Rip\b/i, { value: 20 });
ptt.addHandler("score", /\b(?:HD-?)?TVRip\b/i, { value: 19 });
ptt.addHandler("score", /\bTV-?Rip\b/i, { value: 18 });

ptt.addHandler("score", /\b(?:DL|WEB|BD|BR)MUX\b/i, { value: 17 });
ptt.addHandler("score", /\bDVDscr\b/i, { value: 16 });

class TorrentSource {
  constructor(sourceName) {
    this.sourceName = sourceName;
  }

  reconstitute(results, query, type) {
    const parsedResults = [];

    for (const item of results) {
      try {
        // return undefined if no seeders
        if (item.seeders >= 1) {
          // at least match query by 20%
          const similarity = compareTwoStrings(query, item.fileName);
          if (similarity >= 0.2) {
            const torrentData = ptt.parse(item.fileName);

            if (this.isTorrentOfType(torrentData, type)) {
              if (!torrentData.score) {
                torrentData.score = 0;
              }
              torrentData.score += Number(similarity.toFixed(3));

              // add source site name
              torrentData.sourceName = this.sourceName;

              parsedResults.push({ ...item, ...torrentData });
            }
          }
        }
      } catch (err) {
        console.log("\u2717 There was an error parsing " + this.sourceName);
        console.error(err.message);
      }
    }

    return parsedResults;
  }

  isTorrentOfType(torrent, type) {
    /*eslint-disable */
    if (type) {
      switch (type) {
        case "movie":
        case "movies":
          const isSeries = torrent.episode || torrent.season;
          return isSeries ? false : true;
          break;
        case "tv":
        case "series":
          return torrent.episode || torrent.season;
          break;
        default:
          return true;
      }

      return true;
    }
    /*eslint-enable */

    return true;
  }
}

module.exports = TorrentSource;
