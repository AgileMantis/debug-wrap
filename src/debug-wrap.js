/* debug.js
 * version: 0.1.0
 * author: Daniel Schaffer/GSN Social
 * license: MIT
 * https://github.com/DanielSchaffer/debug
 */
(function (global) {
    'use strict';

    var hasModule = (typeof global.module !== 'undefined' && global.module.exports && typeof global.require !== 'undefined');

    // this implementation does not store logs to be recalled later
    // if this functionality is desired, take a look at the setCallback functionality here: http://benalman.com/projects/javascript-debug-console-log/
    function debugWrap() {
        var con = global.console,
            filters = global.__debugFilter,
            isRegExpFilter = /^\//,
            methodNames = [ 'error', 'warn', 'info', 'log', 'debug', 'trace' ];

        // convert the string key into a regexp
        function getRegExpFilter(pattern) {
            var parts = pattern.split('/');
            return new RegExp(parts[1], parts.length > 2 ? parts[2] : undefined);
        }

        function bindLogMethod(moduleName, prefix, methodName) {
            if (con) {
                var method;
                if (con[methodName]) {
                    method = con[methodName];
                } else if (con.log) {
                    method = con.log;
                }
                if (method) {
                    if (filters && !filters.disabled) {
                        var allowedMethods;
                        for (var prop in filters) {
                            if (filters.hasOwnProperty(prop) && prop !== '_default') {
                                var matchesModule = prop === moduleName ||
                                    (isRegExpFilter.test(prop) && getRegExpFilter(prop).test(moduleName));

                                if (matchesModule) {
                                    allowedMethods = filters[prop];
                                    break;
                                }
                            }
                        }

                        allowedMethods = allowedMethods || filters._default || [];
                        if (allowedMethods.indexOf(methodName) < 0) {
                            return function () {
                            };
                        }
                    }

                    if (typeof(method) === 'function' && method.bind) {
                        return method.bind(con, prefix);
                    } else {
                        // native functions in older versions of IE aren't real functions, so we can't call bind() on them
                        // IE doesn't have a native bind() function, and modernizr's polyfill doesn't work with IE's native functions
                        // so, we need to default to what modernizr ends up doing anyways

                        // additionally, PhantomJS (used for testing) does not currently support Function.prototype.bind
                        // the issue is reported here: https://github.com/ariya/phantomjs/issues/10522
                        // possible polyfill available: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FFunction%2Fbind
                        return function bind() {
                            var args = Array.prototype.slice.call(arguments, 0);
                            if (typeof(prefix) !== 'undefined') {
                                args.unshift(prefix);
                            }

                            // work around the fact that IE doesn't add spaces between log arguments like everyone else
                            if (typeof(method) !== 'function') {
                                args = args.join(' ###').split('###');
                            }

                            Function.prototype.apply.apply(method, [ con, args ]);
                        };
                    }
                }
            }

            return function noop() { };
        }

        function debugLogger(moduleName) {
            var prefix = '',
                logger,
                i;
            if (typeof(moduleName) !== 'undefined') {
                prefix = '[' + moduleName + ']';
            }

            logger = bindLogMethod(moduleName, prefix, 'debug');
            logger.label = function applyLabel(label) {
                return debugLogger(moduleName + ': ' + label);
            };

            for (i = 0; i < methodNames.length; i++) {
                var methodName = methodNames[i];
                logger[methodName] = bindLogMethod(moduleName, prefix, methodName);
            }
            logger.debugLogger = debugLogger;
            return logger;
        }

        debugLogger.__debugLogger = true;

        return debugLogger;
    }

    global.debugWrap = debugWrap;

    if (hasModule) {
        global.module.exports = debugWrap;
    } else if (typeof(global.define) === 'function' && define.amd) {
        global.define('debug-wrap', [], debugWrap);
    }

}(this));