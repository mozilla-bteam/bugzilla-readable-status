# Bugzilla Readable Status Messages

Generate readable, english language, status messages from properties of bugs in bugzilla.mozilla.org.

The module exposes a single method, `readable,` which can be called in a variety of ways:

* an object whos properties correspond to a bugs properties.
* the id of a bug (to be implemented)
* an array of objects containing bug properties
* an array of bug ids (to be implemented)

## Usage

```
var readable = import('bugzilla-readable-status').readable;

var status = readable({ bugid: NNNNNN, status: 'NEW', … });

// => 'BUG STATUS'

var statuses = readable([
        { bugid: NNNNNN, status: 'FIXED' … }.
        { bugid: MMMMMM, status: 'NEW' … },
        …
    ]);

// => { "statuses": [
        { "bugid": NNNNNN, "status": "BUG STATUS" },
        { "bugid": MMMMMM, "status": "BUG STATUS" },
        …
    ]}

var emptyArray = readable([]);

// => { "result": [] }
```

## Errors

Errors are returned as objects:

```
{ "error": "ERROR STRING" }
```

### No Data

If there are no usable properties or the module can't generate, "NO_STRING_FOR_BUG"

### Errors in Requests for Multiple Bugs 

If multiple bugs are requested, and errors are found, the errors are included in the reponse object:

```
{ "statuses": [
        { "bugid": "BUG ID", 
          "status": "BUG STATUS" },
        …
        { "bugid": "BUG ID WITH ERROR",
          "error": "ERROR MESSAGE" }
        …
    ]}
```

