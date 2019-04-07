const crypto = require('crypto');
// const hashes = crypto.getHashes();
// console.log(hashes);
module.exports = str => {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

// 为什么 crypto.createHmac('md5');就不行??
