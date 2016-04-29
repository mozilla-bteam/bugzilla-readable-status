var set_error = function(message) {
    return { error: message };
}

var parse = function(bug) {
 
    var readable = '';

    if (typeof bug.bugid === 'undefined' ||
        typeof bug.status === 'undefined') {
        return set_error('NO_STRING_FOR_BUG');
    }

    readable = bug.status.toUpperCase() + ' bug';

    if (bug.triage && bug.triage.toLowerCase() === 'untriaged') {
        readable = 'UNTRIAGED ' + readable;
    }

    return readable;
}

exports.readable = function(args) {

    if (args === undefined) {
        return set_error('NO_BUG_INFO');
    }

    if (Array.isArray(args)) {
        var results = { statuses: [] };
        args.forEach(function(bug) {
            var status = {};
            var result = parse(bug);

            if (typeof result.error !== 'undefined') {
                status.error = result.error;
            }
            else {
                status.status = result;
            }
            status.bugid = bug.bugid;
            
            results.statuses.push(status);
        });
        return results;
    }

    return parse(args); 
};
