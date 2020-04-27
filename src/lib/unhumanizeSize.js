const powers = { k: 1, m: 2, g: 3, t: 4 };
const regex = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i;

const unhumanizeSize = size => {
  let res = regex.exec(size);

  if (!res[2]) {
    return 0;
  }

  return res[1] * Math.pow(1024, powers[res[2].toLowerCase()]);
};

module.exports = unhumanizeSize;
