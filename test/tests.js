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
            var result = readable([{}, {}, {}]);
            result.result.length.should.equal(3);
        });
    });
    describe('Object', function() {
        it('If called with something else, should return a string', function() {
            readable({status: 'murble'}).should.equal('MURBLE bug');
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
            readable({status: 'tweaked'}).should.equal('TWEAKED bug');
        });
    });
    describe('Triage', function() {
        it('Should start with \'untriaged\' if bug is untriaged', function() {
            readable({status: 'weird', triage: 'UNTRIAGED'}).should.equal('UNTRIAGED WEIRD bug');
        });
    });
});
