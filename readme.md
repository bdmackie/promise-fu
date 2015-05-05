Promise Fu
==========

A small library providing helpers for working with promises and asynchronous programming.

## Installation

  npm install promise-fu

## Example 1

```javascript
    var c = new PromiseChain();
    return c.addResolver(f1)
        .addResolvers([f2, f3])
        .addResolver(f4)
        .then(function() {
            console.log("First ran f1, then f2 & f3 in parallel, then joined to run f4 and then finish.");
        });
```

## Example 2

```javascript
    var c = new PromiseChain();
    return c.addResolver(f1)
    	.fork()
        .addResolver(f2)
        .addResolver(f3)
        .join()
        .addResolver(f4)
        .then(function() {
        	console.log("First ran f1, then f2 & f3 in parallel, then joined to run f4 and then finish.");
        });
```

## Tests

  npm test