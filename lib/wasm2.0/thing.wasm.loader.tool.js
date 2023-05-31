let _macros = {};
const _postMethod = "GET";
const _authDefaultPostField = "thingjs Request";

function parseValue(value, defaultValue) {
    if (value === undefined || value === null) {
        return defaultValue;
    } else {
        return value;
    }
}

function login(method, url, requestHeaders, postFields) {
    return wasmLoader.resourceDownloader.login(method, url, requestHeaders, postFields);
}

function loadWasmModule(wasmRootPath) {
    // Prevent to call multiple times
    if (window.wasmLoader) {
        return wasmLoader.loadingPromise;
    }

    // Start to load WASM module
    wasmLoader = new THING.WASM.LOADER.WasmLoader();
    return wasmLoader.init({
        wasmRootPath,
    });
}

THING.Utils.loadJSONFileAsync = function (url) {
    return new Promise((res, rej) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json'
        xhr.send();
        xhr.onload = function () {
            res(xhr.response);
        };
    });
};

/**
 * Wait for auth complete.
 * @param {Object} options The options.
 * @param {String} options.url The auth resource url.
 * @param {String} options.wasmRootPath The wasm root path.
 * @return {Promise<any>}
 */
THING.Utils.login = function (options = {}) {
    let url = options['url'];
    let wasmRootPath = options['wasmRootPath'];
    let method = parseValue(options['method'], _postMethod);
    let requestHeaders = parseValue(options['requestHeaders'], '');
    let postFields = parseValue(options['postFields'], '');

    return new Promise(async (resolve, reject) => {
        let module = await loadWasmModule(wasmRootPath);
        let helper = module.Helper;

        // Add wasm module version and compile time
        let platformInfo = helper.getPlatformInfo();
        if (platformInfo) {
            let macros = _macros;
            macros['WASM'] = {
                VERSION: platformInfo.version,
                COMPILETIME: platformInfo.compileTime
            };

            // Add to THING namespace also
            if (typeof THING !== 'undefined') {
                THING.WASM = THING.WASM || {};
                THING.WASM['VERSION'] = platformInfo.version;
                THING.WASM['COMPILETIME'] = platformInfo.compileTime;
            }
        }

        _authData = await login(method, url, requestHeaders, postFields);

        resolve();
    });
}