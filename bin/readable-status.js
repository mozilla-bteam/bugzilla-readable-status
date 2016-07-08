#! /usr/bin/env node

var fetch = require('node-fetch');
var readable = require('../index').readable;

// check arguments

if (process.argv.length < 3) {
    process.exit(1);
}

var args = process.argv.slice(2);
var bugid = args.shift();

// request bug

fetch('https://bugzilla.mozilla.org/rest/bug/' + bugid).
    then(function(res) { 
        if (res.ok) {
            res.json().then(function(json) {
                var bug = json.bugs.shift();
                var result = readable(bug);
                if (result.error) {
                    console.log(result.error);
                } else {
                    console.log(result);
                }
            });
        } else {
            console.log(res.statusText);
            process.exit(1);   
        } 
    }).
    catch(function(error) {
        console.log('Failed to reach bugzilla.mozilla.org.');
        process.exit(1);
    });

