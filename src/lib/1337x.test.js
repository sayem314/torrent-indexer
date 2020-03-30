const test = require("ava");
const { search } = require("./1337x");
const { sources } = require("../config");
const { expect } = require("chai");

test("should work properly", async () => {
  const { url } = sources.leetx;
  const results = await search("rick and morty s04e01", url, 1);
  expect(results).to.be.an("array");
  expect(results.length).to.be.at.least(5);

  for (const item of results) {
    expect(item.title).to.be.an("string");
    expect(item.title.length).to.be.at.least(10);

    expect(item.seeds).to.be.at.an("number");
    expect(item.seeds).to.be.at.least(0);

    expect(item.leechs).to.be.at.an("number");
    expect(item.leechs).to.be.at.least(0);

    expect(item.date_added).to.be.an("string");
    expect(item.date_added.length).to.be.at.least(10);

    expect(item.size).to.be.an("string");
    expect(item.size).to.include(".");

    expect(item.torrent_site).to.be.an("string");
    expect(item.torrent_site).to.include(url);
  }
});
