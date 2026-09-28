# Tests

Run with `npm test`.

Edge cases covered:
- malformed and non-web URLs;
- `www.` hostname handling;
- path traversal and filesystem separators;
- empty template variables and repeated separators;
- unknown template variables;
- exact domain matching and deceptive suffixes;
- wildcard and case-insensitive domain rules;
- most-specific domain precedence;
- malformed rule storage;
- mutation of stored rule arrays;
- empty active-tab results.

The suite uses Node's built-in `node:test` runner and requires no test dependency.
