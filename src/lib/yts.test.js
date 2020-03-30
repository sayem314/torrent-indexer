const test = require("ava");
const { search } = require("./yts");
const { sources } = require("../config");
const { expect } = require("chai");

test("should work properly", async () => {
  const { url } = sources.yts;
  const results = await search("x-men: dark phoenix 2019", url, 1);
  expect(results).to.be.an("array");
  expect(results.length).to.be.at.least(2);

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

    expect(item.torrent_link).to.be.an("string");
    expect(item.torrent_link).to.include(url + "/torrent/download/");
  }
});
