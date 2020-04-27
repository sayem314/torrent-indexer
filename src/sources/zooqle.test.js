const test = require("ava");
const Zooqle = require("./zooqle");
const { sources } = require("../config");
const { expect } = require("chai");

const zooqle = new Zooqle(sources.zooqle);

test("should work properly", async () => {
  const results = await zooqle.search("rick and morty s04e01");
  expect(results).to.be.an("array");
  expect(results.length).to.be.at.least(5);

  for (const item of results) {
    expect(item.fileName).to.be.an("string");
    expect(item.fileName.length).to.be.at.least(10);

    expect(item.seeders).to.be.an("number");
    expect(item.seeders).to.be.least(0);

    expect(item.leechers).to.be.an("number");
    expect(item.leechers).to.be.least(0);

    expect(item.uploaded).to.be.an("string");
    expect(item.uploaded.length).to.be.at.least(5);

    expect(item.size).to.be.an("string");
    expect(item.size).to.include("B");

    expect(item.length).to.be.an("number");
    expect(item.length).to.be.least(1024);

    expect(item.link).to.be.an("string");
    expect(item.link).to.include("magnet:?xt=urn:btih:");
  }
});
