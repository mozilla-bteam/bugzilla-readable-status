console.log('in index.js');

var parse = function() {
    return 'parsed bug';
}

exports.readable = function(args) {

    if (args === undefined) {
        return {'error': 'NO_BUG_INFO'};
    }

    if (Array.isArray(args)) {
        var result = { result: [] };
        args.forEach(function() {
            result.result.push(parse());
        });
        return result;
    }

    return parse(); 
};
