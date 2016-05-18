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
            var result = readable([{ id: 12345, status: 'NEW' }, 
                                   { id: 67890, status: 'FIXED' }, 
                                   { id: 55555, status: 'RESOLVED' }]);
            result.statuses.length.should.equal(3);
        });
    });
    describe('Object', function() {
        it('If called with something else, should return a string', function() {
            readable({id: 12345, status: 'RESOLVED', resolution: 'FIXED'})
                .should.equal('bug RESOLVED as FIXED');
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
            readable({id: 67890, status: 'tweaked', resolution: 'foggy'}).should.equal('TWEAKED bug');
        });
    });
    describe('Triage', function() {
        it('Should start with \'untriaged\' if bug is untriaged', function() {
            readable({id: 12345, status: 'weird', resolution: '---', triage: 'UNTRIAGED'})
                .should.equal('UNTRIAGED WEIRD bug');
        });
    });
});

describe('Statuses', function() {
    describe('Verified', function() {
        it('Should describe verified bugs as just being fixed', function() {
            readable({id: 12345, status: 'VERIFIED', resolution: 'aslfjsalfj', triage: 'TRIAGED', 
                target_milestone: 'mozilla89',
                cf_tracking_firefox88: '+', cf_status_firefox87: 'affected'})
                .should.equal('bug has been fixed and VERIFIED for Firefox 89 found in Firefox 87 which is tracked for Firefox 88');
        });
    });

    describe('Closed', function() {
        it('Should describe closed bugs correctly', function() {
            readable({id: 12345, status: 'CLOSED', resolution: 'WONTFIX'})
            .should.equal('bug CLOSED as WONTFIX');
        });
        it('Should describe duplicate bugs correctly', function() {
            readable({id: 12345, status: 'CLOSED', resolution: 'DUPLICATE', dupe_of: 88888})
            .should.equal('bug CLOSED as DUPLICATE of 88888');
        });
    });

    describe('Resolved', function() {
        it('Should describe resolved bugs correctly', function() {
            readable({id: 12345, status: 'RESOLVED', resolution: 'WONTFIX'})
            .should.equal('bug RESOLVED as WONTFIX');
        });
        it('Should describe duplicate bugs correctly', function() {
            readable({id: 12345, status: 'RESOLVED', resolution: 'DUPLICATE', dupe_of: 88888})
            .should.equal('bug RESOLVED as DUPLICATE of 88888');
        });
    });
    
    describe('Fixed', function() {
        it('Should describe fixed bugs correctly', function() {
            readable({id: 12345, status: 'RESOLVED', resolution: 'FIXED'})
            .should.equal('bug RESOLVED as FIXED');
        });
    });
});

describe('Regression', function() {
    it('Should report regressions', function() {
        readable({id: 12345, status: 'NEW', resolution: '---', 
            keywords: ['regression'], cf_status_firefox99: 'affected'})
            .should.equal('NEW regression bug found in Firefox 99');
    });
    it('Should report duplicate regressions', function() {
        readable({id: 12345, status: 'RESOLVED', resolution: 'DUPLICATE',
            keywords: ['regression', 'late suppper'], cf_status_firefox88: 'affected', 
            dupe_of: 66666})
            .should.equal('regression bug RESOLVED as DUPLICATE of 66666');
    });
});

describe('Found in', function() {
    it('Should report if a bug has a status flag set', function() {
        readable({id: 12345, status: 'disconcerting', resolution: '---',
            triage: 'TRIAGED', cf_status_firefox88: 'affected'})
            .should.equal('DISCONCERTING bug found in Firefox 88');
    });

    it ('Should report the earliest version the bug was found in', function() {
        readable({id: 12345, status: 'horrible', resolution: '---',
            triage: 'TRIAGED', cf_status_firefox90: 'unaffected', cf_status_firefox91: 'affected',
            cf_status_firefox92: 'affected'})
            .should.equal('HORRIBLE bug found in Firefox 91');
    });
});

describe('Priority', function() {
    it ('Should report the earliest version the bug was found in', function() {
        readable({id: 12345, status: 'horrible', resolution: '---',
            triage: 'TRIAGED', cf_status_firefox90: 'unaffected', cf_status_firefox91: 'affected',
            cf_status_firefox92: 'affected', priority: '--'})
            .should.equal('HORRIBLE bug found in Firefox 91 with no priority');
    });    
});

describe('Tracking', function() {
    it('Should report if a bug is tracking a release', function() {
        readable({id: 12345, status: 'bewildering', resolution: '---',
            cf_tracking_firefox22: '+', cf_tracking_firefox23: '?',
            cf_tracking_firefox21: '-'})
            .should.equal('BEWILDERING bug which is tracked for Firefox 22');
    });

    it('Should report the earliest version a bug is being release tracked for', function() {
        readable({id: 12345, status: 'bewildering', resolution: '---',
            cf_tracking_firefox22: '+', cf_tracking_firefox23: '+',
            cf_tracking_firefox21: '-'})
            .should.equal('BEWILDERING bug which is tracked for Firefox 22');
    });
});

describe('Release version', function() {
    it('Should report the release version if fixed', function() {
        readable({id: 12345, status: 'RESOLVED', resolution: 'FIXED',
            target_milestone: 'mozilla101'}).should.equal('bug RESOLVED as FIXED for Firefox 101');
    });
    
    it ('Should report any uplifts besides the release version', function() {
        readable({id: 12345, status: 'RESOLVED', resolution: 'FIXED',
            target_milestone: 'mozilla101', cf_tracking_firefox100: '+'})
            .should.equal('bug RESOLVED as FIXED for Firefox 101 which is tracked for Firefox 100');
    });
});

describe('Need Info', function() {
    it('Should report if a bug has an open need info', function() {
        readable({id: 12345, status: 'obvious', resolution: '---',
            flags: [ { name: 'needinfo', status: '?' } ]}).
            should.equal('OBVIOUS bug awaiting an answer on a request for information');
    });
});
