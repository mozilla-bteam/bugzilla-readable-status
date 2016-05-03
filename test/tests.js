var should   = require('chai').should();
var readable = require('../index').readable;

describe('Signatures', function() {
    describe('Required', function() {
        it('Should return an error when called without arguments', function() {
            readable().should.deep.equal({error: 'NO_BUG_INFO'});
        });
    });
    describe('Array', function() {
        it('If called with an array, should return an array of results', function() {
            var result = readable([{ bugid: 12345, status: 'NEW' }, 
                                   { bugid: 67890, status: 'FIXED' }, 
                                   { bugid: 55555, status: 'RESOLVED' }]);
            result.statuses.length.should.equal(3);
        });
    });
    describe('Object', function() {
        it('If called with something else, should return a string', function() {
            readable({bugid: 12345, status: 'murble'}).should.equal('MURBLE bug');
        });
    });
    describe('Missing', function() {
        it('If called with no valid bug properties, should return an error', function() {
            readable({}).should.deep.equal({error: 'NO_STRING_FOR_BUG'});
        });
    });
});

describe('Parsing', function() {
    describe('Status', function() {
        it('Should return a sentence based on the bug\'s status', function() {
            readable({bugid: 67890, status: 'tweaked'}).should.equal('TWEAKED bug');
        });
    });
    describe('Triage', function() {
        it('Should start with \'untriaged\' if bug is untriaged', function() {
            readable({bugid: 12345, status: 'weird', triage: 'UNTRIAGED'}).
                should.equal('UNTRIAGED WEIRD bug');
        });
    });
});

describe('Found in', function() {
    it('Should report if a bug has a status flag set', function() {
        readable({bugid: 12345, status: 'disconcerting', triage: 'TRIAGED', cf_status_firefox88: 'affected'}).
            should.equal('DISCONCERTING bug found in Firefox 88');
    });

    it ('Should report the earliest version the bug was found in', function() {
        readable({bugid: 12345, status: 'horrible', triage: 'TRIAGED', cf_status_firefox90: 'unaffected', cf_status_firefox91: 'affected',
            cf_status_firefox92: 'affected'}).should.equal('HORRIBLE bug found in Firefox 91');
    });
});

describe('Tracking', function() {
    it('Should report if a bug is tracking a release', function() {
        readable({bugid: 12345, status: 'bewildering', cf_tracking_firefox22: '+', cf_tracking_firefox23: '?',
            cf_tracking_firefox21: '-'}).should.equal('BEWILDERING bug which is tracked for Firefox 22');
    });
});
