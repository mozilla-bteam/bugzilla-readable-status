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
            var result = readable([1, 2, 3]);
            result.result.length.should.equal(3);
        });
    });
    describe('String', function() {
        it('If called with something else, should return a string', function() {
            readable({}).should.equal('parsed bug');
        });
    });
});
