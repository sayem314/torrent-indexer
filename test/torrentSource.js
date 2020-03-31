const test = require("ava");
const { expect } = require("chai");
const TorrentSource = require("./../src/lib/torrentSource");

class TestSource extends TorrentSource {
  constructor(name) {
    super(name);
  }

  async search(results, type) {
    return super.reconstitute(results, results[0].title, type);
  }
}

const testSource = new TestSource("testSource");
const testResults = [
  { title: "Test Result 2017 s01e06", seeds: 1 },
  { title: "Test Result 2017 1x10", seeds: 1 },
  { title: "Test Result 2017", seeds: 1 }
];

test("should add fileName and sourceName properly", async () => {
  const results = await testSource.search([
    { title: "Test Result 2017", seeds: 1 }
  ]);
  expect(results[0].sourceName).to.equal("testSource");
  expect(results[0].fileName).to.equal("Test Result 2017");
});

test("should respect type: movie", async () => {
  const results = await testSource.search(testResults, "movie");
  expect(results.length).to.equal(1);
  expect(Object.keys(results[0])).not.to.include("episode");
  expect(Object.keys(results[0])).not.to.include("season");
});

test("should respect type: series", async () => {
  const results = await testSource.search(testResults, "series");
  expect(results.length).to.equal(2);
  expect(Object.keys(results[0])).to.include("episode");
  expect(Object.keys(results[0])).to.include("season");
  expect(Object.keys(results[1])).to.include("episode");
  expect(Object.keys(results[1])).to.include("season");
});

test("should respect if type: undefined", async () => {
  const results = await testSource.search(testResults);
  expect(results.length).to.equal(3);
});
