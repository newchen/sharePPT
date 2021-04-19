var JSONBIGINT = require('json-bigint');

var str = '{ "value" : 9223372036854775807, "v2": 123 }';
console.log('原数据: ', str);

console.log('*************************');
var v1 = JSON.parse(str)
console.log('JSON.parse: ', v1.value.toString())
console.log('JSON.stringify: ', JSON.stringify(v1))

console.log('*************************');
var v2 = JSONBIGINT.parse(str)
console.log('JSONBIGINT.parse: ', v2.value.toString())
console.log('JSONBIGINT.stringify: ', JSONBIGINT.stringify(v2))


