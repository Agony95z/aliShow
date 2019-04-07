var moment = require('moment');
var data = Date.now();
console.log(data);
var xx = moment(data).format('YYYY-MM-DD,HH:mm:ss')
console.log(xx);