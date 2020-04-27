const test = require("ava");
const Yts = require("./yts");
const { sources } = require("../config");
const { expect } = require("chai");

const yts = new Yts(sources.yts);

test("should work properly", async () => {
  const { url } = sources.yts;
  const results = await yts.search("x-men: dark phoenix 2019");
  expect(results).to.be.an("array");
  expect(results.length).to.be.at.least(2);

  for (const item of results) {
    expect(item.title).to.be.equal("X-Men: Dark Phoenix");
    expect(item.fileName).to.be.an("string");
    expect(item.fileName.length).to.be.at.least(10);

    expect(item.seeders).to.be.an("number");
    expect(item.seeders).to.be.least(0);

    expect(item.leechers).to.be.an("number");
    expect(item.leechers).to.be.least(0);

    expect(item.uploaded).to.be.an("string");
    expect(item.uploaded.length).to.be.at.least(6);

    expect(item.size).to.be.an("string");
    expect(item.size).to.include("B");

    expect(item.length).to.be.an("number");
    expect(item.length).to.be.least(1024);

    expect(item.link).to.be.an("string");
    expect(item.link).to.include(url + "/torrent/download/");
  }
});
