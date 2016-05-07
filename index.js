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
    var bugType = '';

    // check for minimal data

    if (typeof this.data.id === 'undefined' ||
        typeof this.data.status === 'undefined' ||
        typeof this.data.resolution === 'undefined') {
        return set_error('NO_STRING_FOR_BUG');
    }

    // is regression?
    
    if (this.hasKeyword('regression')) {
        bugType = 'regression bug';
    }
    else {
        bugType = 'bug';   
    }

    // add bug status

    if (this.data.status.toUpperCase() === 'VERIFIED') {
        return 'bug has been fixed and VERIFIED';
    } else if (['CLOSED', 'RESOLVED'].indexOf(this.data.status.toUpperCase()) > -1) {

        readable = bugType + ' ' + this.data.status.toUpperCase() + ' as ' + this.data.resolution; 

        if (this.data.resolution.toUpperCase() === 'DUPLICATE') {
            readable +=  ' of ' + this.data.dupe_of;
            return readable;
        }
        else if (this.data.resolution.toUpperCase() != 'FIXED') {
            return readable;
        } 
    }
    else {
        readable = this.data.status.toUpperCase() + ' ' + bugType;
    }
   
    // prefix if untriaged

    if (this.data.triage && this.data.triage.toLowerCase() === 'untriaged') {
        readable = 'UNTRIAGED ' + readable;
    }

    // do you know where it was first found?

    firstAffected = this.firstAffected();

    if (firstAffected) {
        readable += ' found in Firefox ' + firstAffected;
    }

    // do you know if it's tracked for a release

    firstTracked = this.firstTracked();

    if (firstTracked) {
        readable += ' which is tracked for Firefox ' + firstTracked;
    }
    else if (this.data.resolution != 'FIXED') {
        // otherwise see if there's a priority set for the bug
        readable += this.getPriority();
    }

    // do you know if there's an open needinfo 

    if (this.hasNeedInfo()) {
        readable += ' awaiting an answer on a request for information';
    }

    return readable;
}

Bug.prototype.getPriority = function() {
    var priority;

    switch (this.data.priority) {
        case '--':
            priority = ' for which no priority has been set';
            break;
        case 'P1': 
            priority = ' which should be worked on in the current release/iteration';
            break;
        case 'P2': 
            priority = ' which should be worked on in the next release/iteration';
            break;
        case 'P3':
            priority = ' which is a feature request';
            break;
        case 'P4':
            priority = ' which is a long term backlog item';
            break;
        case 'P5':
            priority = ' which will not be worked on by staff, but a patch will be accepted';
            break;
        default:
            priority = '';
    }

    return priority;
}

Bug.prototype.hasKeyword = function(keyword) {
    return (this.data.keywords && this.data.keywords.indexOf(keyword) > -1);
};

Bug.prototype.hasFlag = function(name, status) {
    return (this.data.flags && this.data.flags.some(function(flag, i, arry) {
        return (flag.name === name && flag.status === status);
    }));
};

Bug.prototype.hasNeedInfo = function() {
    return this.hasFlag('needinfo', '?');
};

Bug.prototype.getFlags = function(flag) {
    var flags, keys = Object.keys(this.data);

    flags = keys.filter(function(key, i, arr) {
        return (key.indexOf(flag) === 0);
    });

    return flags.sort();
};

Bug.prototype.getAffectedReleases = function() {
    if (typeof this.statusFlags === 'undefined') {
        this.statusFlags = this.getFlags('cf_status_firefox');
    }

    return this.statusFlags.filter(function(flag, i, arr) {
        return (['affected'].indexOf(this.data[flag]) > -1);
    }, this);
};

Bug.prototype.firstAffected = function() {

    var affected;

    if (typeof this.statusFlags === 'undefined') {
        this.statusFlags = this.getFlags('cf_status_firefox');
    }

    affected = this.getAffectedReleases();

    if (affected.length > 0) {
        return affected[0].split('cf_status_firefox')[1];
    }
    else {
        return '';
    }
}

Bug.prototype.getTrackedReleases = function() {
    if (typeof this.trackingFlags === 'undefined') {
        this.trackingFlags = this.getFlags('cf_tracking_firefox');
    }

    return this.trackingFlags.filter(function(flag, i, arr) {
        return (['+'].indexOf(this.data[flag]) > -1);
    }, this);
};

Bug.prototype.firstTracked = function() {

    var tracking;

    if (typeof this.trackingFlags === 'undefined') {
        this.trackingFlags = this.getFlags('cf_tracking_firefox');
    }

    tracking = this.getTrackedReleases();

    if (tracking.length > 0) {
        return tracking[0].split('cf_tracking_firefox')[1];
    }
    else {
        return '';
    }
}

// export the readable description function 

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
            status.id = bug.data.id;
            
            results.statuses.push(status);
        });
        return results;
    }

    var bug = new Bug(args);

    return bug.parse(); 
};
