console.log('in index.js');

var parse = function(bug) {
    readable = '';

    if (bug.status) {
        readable = bug.status.toUpperCase() + ' bug';
    }

    if (bug.triage && bug.triage.toLowerCase() === 'untriaged') {
        readable = 'UNTRIAGED ' + readable;
    }

    if (readable === '') {
        return { error: 'NO_STRING_FOR_BUG' };
    }

    return readable;
}

exports.readable = function(args) {

    if (args === undefined) {
        return {'error': 'NO_BUG_INFO'};
    }

    if (Array.isArray(args)) {
        var result = { result: [] };
        args.forEach(function(bug) {
            result.result.push(parse(bug));
        });
        return result;
    }

    return parse(args); 
};
