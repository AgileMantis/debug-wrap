debug-wrap
==========
A wrapper around the JavaScript `console` object.

`debug-wrap` allows you to use all of the `console` object's features without worrying about browser support. It also allows you to automatically prepend a tag to all console entries, making it easier to identify the source module.

## Usage

```javascript
require(['debug-wrap'], function myModule(debugWrap) {
    var debug = debugWrap('myModule'),
        myObj = {},
        value;
        
    debug('here is my module');
    
    debug('attempting to access property');
    try {
        value = myObj.foo.bar;
    } catch (ex) {
        debug.error('unable to access property', ex);
    }
});
```