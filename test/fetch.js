var fetch = require('node-fetch');
var readable = require('../index').readable;
fetch('https://bugzilla.mozilla.org/rest/bug?chfield=[Bug%20creation]&chfieldfrom=2016-01-01&chfieldto=2016-01-31&product=Core&product=Firefox&product=Firefox%20for%20Android&product=Firefox%20for%20iOS&product=Toolkit&limit=100').then(function(res) { return res.json(); }).then(function(json) { console.log(readable(json.bugs)); });
