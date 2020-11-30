process.env.HMR_PORT=63009;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"unbundle.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _lab = require("@material-ui/lab");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Store = require('electron-store'); // Settings Loading


if (!Store) {
  console.warn("NO STORE found");
}

const settings = new Store({
  defaults: {
    pageSize: 25
  }
}); //import {$} from "jquery";

const $ = require("jquery");

const regeneratorRuntime = require("regenerator-runtime");

console.log("bundle :D"); // Localizations

function formatDuration(seconds) {
  let curSecs = seconds;
  let out = "";

  if (curSecs > 60 * 60) {
    out += Math.floor(curSecs / (60 * 60)) + ":";
    curSecs = curSecs % (60 * 60);
  }

  out += Math.floor(curSecs / 60).toString().padStart(2, "0") + ":" + (curSecs % 60).toString().padStart(2, "0");
  return out;
} // Constants


const columnTypes = {
  playlists: ["Name", "Date", "Songs Count"],
  songs: ["Name", "Artist", "Duration"],
  albums: ["Name", "Last Updated", "Songs"]
};
const columnProps = {
  playlists: [item => item.name, item => item.createdAt, item => JSON.parse(item.contents).length],
  songs: [item => item.name, item => item.artist, item => item.duration ? formatDuration(item.duration) : "Unknown"],
  albums: [item => item.name, item => item.updatedAt, item => JSON.parse(item.contents).length]
};
let musicServer = "http://localhost:3000"; // NO SLASH!
// RIP RepeatedComponent 2020 why did we need that anyway

function capitlizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
} // https://stackoverflow.com/questions/7045065/how-do-i-turn-a-javascript-dictionary-into-an-encoded-url-string


function serialize(obj) {
  var str = [];

  for (var p in obj) str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));

  return str.join("&");
}

function calcColClass(cols) {
  return "s" + 12 / cols;
}

class ResultView extends _react.default.Component {
  constructor(props) {
    super(props); // Deprecated but needed anyway

    this.state = {
      pageIndex: 0,
      type: props.type,
      col1: i18n.__(columnTypes[props.type][0]),
      col2: i18n.__(columnTypes[props.type][1]),
      col3: i18n.__(columnTypes[props.type][2]),
      pageData: []
    };
    this.search.bind(this)();
  }

  shouldComponentUpdate(nextProps) {
    console.info("Update Request");
    const queryChanged = this.props.query !== nextProps.query;
    return queryChanged;
  }

  componentDidUpdate(prevProps) {
    if (this.props.query !== prevProps.query) {
      this.search();
    }
  }

  componentDidMount() {
    // Code to run when component starts
    console.info("Result View Mounted");
    this.search();
    let componentThis = this;
    this.updateSearchInterval = setInterval(function () {
      if (componentThis.query) {
        componentThis.search.bind(componentThis)();
      }
    }, 2500);
  }

  componentWillUnmount() {
    // Componoent dies -> deconstructor
    clearInterval(this.updateSearchInterval);
  }

  async search() {
    console.log("Running Search Request");
    let pageSize = settings.get("pageSize");
    let resp = await (await fetch(musicServer + "/api/fetch_" + this.state.type + "?" + serialize({
      limit: pageSize,
      offset: pageSize * this.state.pageIndex,
      name: this.props.query + "%"
    }))).json();

    if (resp.status == "ok") {
      let data = resp.data;
      console.log("Updating data for " + this.state.query);
      this.setState(function (state, props) {
        return {
          pageData: data
        };
      });
    }
  }

  render() {
    let colgenerator = function (item) {
      // TODO: Move col sizes to constants
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "row wide-item waves-effect waves-light",
        key: item.id,
        "data-id": item.id,
        onclick: this.props.onItemClick
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: "col s6"
      }, columnProps[this.props.type][0](item)), /*#__PURE__*/_react.default.createElement("div", {
        className: "col s3"
      }, columnProps[this.props.type][1](item)), /*#__PURE__*/_react.default.createElement("div", {
        className: "col s3"
      }, columnProps[this.props.type][2](item)));
    };

    let comps = this.state.pageData.map(colgenerator.bind(this));
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "results-wrapper"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "row wide-item"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "col s6"
    }, this.state.col1), /*#__PURE__*/_react.default.createElement("div", {
      className: "col s3"
    }, this.state.col2), /*#__PURE__*/_react.default.createElement("div", {
      className: "col s3"
    }, this.state.col3)), /*#__PURE__*/_react.default.createElement("div", {
      className: "results-rows"
    }, comps), /*#__PURE__*/_react.default.createElement("p", null, i18n.__("Showing "), this.state.pageData.length, " ", i18n.__(" items"), ";"));
  }

}

class PlaylistView extends _react.default.Component {
  constructor(props) {
    super(); //super(props);

    this.state = {
      searchBoxValue: ""
    }; //this.fetchSearch = this.fetchSearch.bind(this);
  }

  componentDidMount() {// Code to run when component is destoryed -> constructor
  }

  componentWillUnmount() {// Componoent dies -> deconstructor
  }

  fetchSearch(event) {
    //console.log(event);
    //console.log("Updating Search");
    let searchValue = event.target.value; //console.log("New search value "+searchValue);

    if (event.target.value) {
      this.setState(function (state, props) {
        return {
          searchBoxValue: searchValue
        };
      });
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      id: "searchbox-playlists",
      className: "searchbox",
      onChange: this.fetchSearch.bind(this),
      onKeyUp: this.fetchSearch.bind(this),
      placeholder: i18n.__("Type to search")
    }), /*#__PURE__*/_react.default.createElement(ResultView, {
      type: "playlists",
      query: this.state.searchBoxValue
    }), /*#__PURE__*/_react.default.createElement("p", null, i18n.__("Current querying "), " ", settings.get("pageSize"), " ", i18n.__(" playlists matching the query "), " ", this.state.searchBoxValue), /*#__PURE__*/_react.default.createElement("div", null));
  }

}

class SongView extends _react.default.Component {
  constructor(props) {
    super(); //super(props);

    this.state = {
      searchBoxValue: ""
    }; //this.fetchSearch = this.fetchSearch.bind(this);
  }

  componentDidMount() {// Code to run when component is destoryed -> constructor
  }

  componentWillUnmount() {// Componoent dies -> deconstructor
  }

  fetchSearch(event) {
    //console.log(event);
    //console.log("Updating Search");
    let searchValue = event.target.value; //console.log("New search value "+searchValue);

    if (event.target.value) {
      this.setState(function (state, props) {
        return {
          searchBoxValue: searchValue
        };
      });
    }
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("input", {
      type: "text",
      id: "searchbox-playlists",
      className: "searchbox",
      onChange: this.fetchSearch.bind(this),
      onKeyUp: this.fetchSearch.bind(this),
      placeholder: i18n.__("Type to search")
    }), /*#__PURE__*/_react.default.createElement(ResultView, {
      type: "songs",
      query: this.state.searchBoxValue
    }), /*#__PURE__*/_react.default.createElement("p", null, i18n.__("Current querying "), " ", settings.get("pageSize"), " ", i18n.__(" songs matching the query "), " ", this.state.searchBoxValue), /*#__PURE__*/_react.default.createElement("div", null));
  }

}

let views = {};
views.playlists = /*#__PURE__*/_react.default.createElement(PlaylistView, null);
views.songs = /*#__PURE__*/_react.default.createElement(SongView, null);
window.debug = {};
window.debug.views = views; // Bootstrap code

if (uiManager) {
  console.log("Binding to uiManager instance ");
  uiManager.on("launchview", function (data) {
    console.log(data);
    console.log("Rendering", data.id);
    console.log(views[data.id]);
    console.log(Object.keys(views));

    _reactDom.default.render(views[data.id], document.getElementById("contentview"));
  }); // Bind to launch view event
} else {
  console.error("Ui manager not found");
}
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = process.env.HMR_HOSTNAME || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + process.env.HMR_PORT + '/');
  ws.onmessage = function(event) {
    checkedAssets = {};
    assetsToAccept = [];

    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function(asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function(asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();

        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) { // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = (
    '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
      '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
      '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
      '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' +
      '<pre>' + stackTrace.innerHTML + '</pre>' +
    '</div>'
  );

  return overlay;

}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;

  var cached = bundle.cache[id];

  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id)
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}

},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","unbundle.js"], null)
//# sourceMappingURL=/bundle.js.map