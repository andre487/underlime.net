const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync('src/index.html', 'utf8');
for (const tag of html.matchAll(/<script\b[^>]*src="https:\/\/[^>]+>/g)) {
    assert.match(tag[0], /\basync\b/);
    assert.doesNotMatch(tag[0], /\bdefer\b/);
}

for (const timing of ['unavailable', 'early', 'late', 'throws']) {
    const handlers = {};
    const initialized = [];
    const element = { on() {}, show() {}, click() {}, attr() {} };
    const context = {
        console: { error() {} },
        document: { getElementById() { return {}; } },
        angular: { element() { return element; } },
        Data: { MESSAGES: { ru: {} } },
        $(selector) {
            return { ...element, on(event, callback) { handlers[selector] = callback; } };
        }
    };
    const window = { default_lang: 'ru', location: '/' };
    function loadSdks() {
        context.VK = window.VK = {
            init() { initialized.push('vk'); if (timing === 'throws') throw Error('SDK failure'); },
            Widgets: { Like() {} }
        };
        context.FB = window.FB = {
            init() { initialized.push('fb'); if (timing === 'throws') throw Error('SDK failure'); },
            XFBML: { parse() {} }
        };
        context.twttr = { widgets: { createShareButton() {} } };
    }
    if (timing === 'early' || timing === 'throws') loadSdks();
    vm.createContext(context);
    vm.runInContext(fs.readFileSync('src/assets/app/controllers/app_controller.js', 'utf8'), context);
    const scope = { $watch() {}, $on() {}, $apply() {} };
    context.AppController(scope, element, window, { path() { return '/ru/index.html'; } });
    context.AppController.initShareWidgets();
    if (timing === 'late') {
        loadSdks();
        handlers['#vk-jssdk']();
        handlers['#facebook-jssdk']();
        handlers['#twitter-wjs']();
    }
    context.AppController.documentStatus('ready');
    assert.equal(scope.status, 'ready');
    assert.deepEqual(initialized, timing === 'unavailable' ? [] : ['vk', 'fb']);
}
console.log('Optional scripts: unavailable, early, late and failing SDKs passed.');
