var set_error = function(message) {
    return { error: message };
}

var Bug = function(data) {
    this.data = data;
    return this;
}

Bug.prototype.parse = function() {
 
    var readable = '';
    var firstAffected = '';

    // check for minimal data

    if (typeof this.data.bugid === 'undefined' ||
        typeof this.data.status === 'undefined') {
        return set_error('NO_STRING_FOR_BUG');
    }

    // add bug status

    readable = this.data.status.toUpperCase() + ' bug';

    // prefix if untriaged

    if (this.data.triage && this.data.triage.toLowerCase() === 'untriaged') {
        readable = 'UNTRIAGED ' + readable;
    }

    // do you know where it was first found?

    firstAffected = this.firstAffected();

    if (firstAffected) {
        readable += ' found in Firefox ' + firstAffected;
    }

    return readable;
}

Bug.prototype.hasFlag = function(name, status) {
    return (this.data.flags && this.data.flags.some(function(flag, i, arry) {
        return (flag.name === name && flag.status === status);
    }));
};

Bug.prototype.hasNeedInfo = function(bug) {
    return this.hasFlag('needinfo', '?');
};

Bug.prototype.getStatusFlags = function() {
    var flags, keys = Object.keys(this.data);

    flags = keys.filter(function(key, i, arr) {
        return (key.indexOf('cf_status_firefox') === 0);
    });

    return flags.sort();
}

Bug.prototype.isTrackingARelease = function() {

    if (typeof this.statusFlags === 'undefined') {
        this.statusFlags = this.getStatusFlags();
    }

    return this.statusFlags.some(function(flag, i, arr) {
        return (['affected'].indexOf(this.data[flag]) > -1);
    }, this);
};

Bug.prototype.firstAffected = function() {
    if (typeof this.statusFlags === 'undefined') {
        this.statusFlags = this.getStatusFlags();
    }

    if (this.statusFlags.length > 0) {
        return this.statusFlags[0].split('cf_status_firefox')[1];
    }
    else {
        return '';
    }
}

/*
Bug.prototype.isFlaggedForARelease = function() {
    var keys = Object.keys(this.data);
    var releaseFlags = keys.filter(function(key, i, arr) {
        return (key.indexOf('cf_tracking_firefox') === 0);
    });
    return releaseFlags.some(function(flag, i, arr) {
        return (['+'].indexOf(this.data[flag]) > -1);
    }, this);
};
*/

exports.readable = function(args) {

    if (args === undefined) {
        return set_error('NO_BUG_INFO');
    }

    if (Array.isArray(args)) {
        var results = { statuses: [] };
        args.forEach(function(item) {
            var status = {};
            var bug    = new Bug(item);
            var result = bug.parse();

            if (typeof result.error !== 'undefined') {
                status.error = result.error;
            }
            else {
                status.status = result;
            }
            status.bugid = bug.data.bugid;
            
            results.statuses.push(status);
        });
        return results;
    }

    var bug = new Bug(args);

    return bug.parse(); 
};
