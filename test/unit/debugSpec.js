describe('debug', function () {

    var console = window.console,
        debugLogger,
        debug,
        context = 0,
        contextRequire;

    function configRequire() {
        contextRequire = require.config({
            baseUrl: '/base/src',
            context: 'context' + (context++).toString()
        });
        return contextRequire;
    }

    function loadDebugModule(done) {
        var ogRequire = contextRequire;
        var require = configRequire();

        require(['debug'], function (_debug_) {
            debugLogger = _debug_;
            debug = debugLogger('unit-test');
            done();
        });
    }



    function mockConsole() {
        var mockedConsole = {};
        for (var prop in console) {
            // note: cannot check for window.console.hasOwnProperty(prop) because "trace" apparently is inherited, at least in WebKit/PhantomJS
            if (typeof(console[prop]) === 'function') {
                mockedConsole[prop] = jasmine.createSpy();
            }
        }
        window.console = mockedConsole;
    }

    describe('can be loaded', function () {
        it('as a require module', function (done) {
            configRequire()(['debug'], function (debug) {
                expect(debug).toBeDefined();
                expect(debug).not.toBeNull();

                done();
            });
        });

        it('on the global scope', function (done) {
            var script = document.createElement('script');
            script.src = '/base/src/debug.js';
            script.onload = function onload() {
                expect(window.debug).toBeDefined();
                expect(window.debug).not.toBeNull();

                done();
            };
            document.head.appendChild(script);
        });

    });

    describe('calling a method', function () {

        beforeEach(mockConsole);

        beforeEach(loadDebugModule);

        it('passes through to the correct method: debug', function () {
            debug('test debug');
            expect(window.console.debug).toHaveBeenCalledWith('[unit-test]', 'test debug');

            debug('test debug explicit');
            expect(window.console.debug).toHaveBeenCalledWith('[unit-test]', 'test debug explicit');
        });

        it('passes through to the correct method: log', function () {
            debug.log('test log');
            expect(window.console.log).toHaveBeenCalledWith('[unit-test]', 'test log');
        });

        it('passes through to the correct method: warn', function () {
            debug.warn('test warn');
            expect(window.console.warn).toHaveBeenCalledWith('[unit-test]', 'test warn');
        });

        it('passes through to the correct method: error', function () {
            debug.error('test error');
            expect(window.console.error).toHaveBeenCalledWith('[unit-test]', 'test error');
        });

        it('passes through to the correct method: trace', function () {
            debug.trace('test trace');
            expect(window.console.trace).toHaveBeenCalledWith('[unit-test]', 'test trace');
        });

        it('passes through to the correct method: info', function () {
            debug.info('test info');
            expect(window.console.info).toHaveBeenCalledWith('[unit-test]', 'test info');
        });
    });

    describe('filters', function () {
        beforeEach(function() {
            window.__debugFilter = {
                'unit-test': ['error']
            };
        });

        beforeEach(mockConsole);

        it('does not pass through messages that have been filtered', function (done) {

            loadDebugModule(function () {
                debug('test debug');
                debug.log('test log');
                debug.trace('test trace');
                debug.warn('test warn');
                expect(window.console.debug).not.toHaveBeenCalled();
                expect(window.console.log).not.toHaveBeenCalled();
                expect(window.console.trace).not.toHaveBeenCalled();
                expect(window.console.warn).not.toHaveBeenCalled();
                done();
            });
        });

        it('passes through messages that have not been filtered', function (done) {

            loadDebugModule(function () {
                debug.error('test error');
                expect(window.console.error).toHaveBeenCalledWith('[unit-test]', 'test error');
                done();
            });
        });
    });

    it('restores the console', function () {
        window.console = console;
    });
});