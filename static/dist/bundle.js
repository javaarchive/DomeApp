process.env.HMR_PORT=57496;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
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
})({"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error;
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;

},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;

},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"player.module.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
module.exports = {
  "player_font": "_player_font_fad94",
  "drop-shadow": "_drop-shadow_fad94",
  "playerTitle": "_playerTitle_fad94",
  "playerItemMadeBy": "_playerItemMadeBy_fad94"
};
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localizedFuncs = void 0;

// Localizations
function formatDuration(seconds) {
  if (!seconds) {
    return "---";
  }

  let curSecs = seconds;
  let out = "";

  if (curSecs > 60 * 60) {
    out += Math.floor(curSecs / (60 * 60)) + ":";
    curSecs = curSecs % (60 * 60);
  }

  out += Math.floor(curSecs / 60).toString().padStart(2, "0") + ":" + (curSecs % 60).toString().padStart(2, "0");
  return out;
}

const localizedFuncs = {
  "en": {
    formatDuration: formatDuration
  }
};
exports.localizedFuncs = localizedFuncs;
},{}],"player.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _playerModule = _interopRequireDefault(require("./player.module.css"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _Grid = _interopRequireDefault(require("@material-ui/core/Grid"));

var _Slider = _interopRequireDefault(require("@material-ui/core/Slider"));

var _utils = require("./utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Fonts (broken currently)
// import "fontsource-roboto";
// Styles
// Text Stuff
// Grid Utils
// Widgets
// Get localized functions
// Event Emitter
const EventEmitter = require('events'); // React Player to be imported
// Meant to be reusable in other contexts


const hasArtist = ["Song"];
const hasMultipleArtists = ["Album"]; // Playlists are usually user created so they will have a variety of artists

if (!i18n) {
  try {
    var i18n = require("i18n");
  } catch (ex) {
    var i18n = null; // Allow custom instances to be added later.
  }
} // Might already be init


function loadAllContentHandlers(settings) {
  return settings.get("enabledContentHandlers").map(require);
}

function getBestContentHandler(uris, ch) {
  // Earlier in the protocol string the better
  // Comma seperated URIs are not fully supported yet
  let uriList = uris.split(",");

  for (let i = 0; i < uriList.length; i++) {
    for (let j = 0; j < ch.length; j++) {
      if (ch[j].canHandle(uriList[i])) {
        return [uriList[i], ch[j]];
      }
    }
  }
}

let contentPlayerCache = {};

class PlayerComponent extends _react.default.Component {
  constructor(props) {
    super(props); // Deprecated but needed

    let preparedState = {
      itemName: i18n.__("Nothing Playing"),
      position: 0,
      itemLength: 0,
      length: 1200,
      enabled: false,
      userDragging: false,
      // Do not update while user is dragging
      internalPlaylist: [],
      playerType: "none"
    };

    if (props.name) {
      preparedState["name"] = props.name;
      preparedState["enabled"] = true;
    }

    if (props.controller) {
      preparedState["controller"] = props.controller;
    } else {
      preparedState["controller"] = new EventEmitter();
    }

    this.state = preparedState;
  }

  tick() {
    if (!this.player) {
      return;
    }

    if (!this.state.userDragging) {
      this.setState(function (state, props) {
        return {
          position: this.state.player.getDuration()
        };
      });
    }
  }

  componentDidMount() {
    this.registerEvents(this.state.controller);
    setInterval(this.tick.bind(this), this.props.settings.get("playerTickrate"));
  }

  setNewController(ee) {
    this.setState(function (state, props) {
      return {
        controller: ee
      };
    });
  }

  async playSong(songData) {
    // Does not check queue
    let uris = songData.contentURI; // TODO: NOT DEPEND ON REQUIRE CACHE

    let [uri, ch] = getBestContentHandler(uris, loadAllContentHandlers(this.props.settings));
    let prefferedPlayer = this.props.settings.get(ch.prefferedPlayerKey);

    let SelectedPlayer = require(prefferedPlayer);

    let player;

    if (this.state.playerType != SelectedPlayer.id) {
      if (this.state.player && this.state.player.unload) {
        await this.state.player.unload();
      }

      player = new SelectedPlayer({
        document: document,
        window: window
      });
      await player.init();
    } else {
      player = this.state.player; // Get existing player
    }

    console.log('Init Finished');
    await player.load(uri);
    console.log("Loaded uri into player");
    await player.play();
    console.log("Playing");
    this.setState(function (state, props) {
      return {
        player: player,
        playerType: SelectedPlayer.id
      };
    });
  }

  registerEvents(ee) {
    if (ee.playerEventsRegistered) {
      return;
    }

    let oThis = this; // original this

    ee.playerEventsRegistered = true;
    ee.on("playSong", async function (songData) {
      // Does not check for queue
      oThis.updateItem("Song", songData);
      await oThis.playSong(songData);
      oThis.setState(function (state, props) {
        return {
          enabled: true
        };
      });
    });
    ee.on("queueSong", async function (songData) {
      oThis.setState(function (state, props) {
        let newPlaylist = new Array(this.state.internalPlaylist);
        newPlaylist.push(songData);
        return {
          internalPlaylist: newPlaylist
        };
      });
    });
  }

  componentWillUnmount() {// Componoent dies -> deconstructor
  }

  get duration() {
    return this.state.duration;
  }

  updateItem(type, params) {
    let properties = {};

    if ("name" in params) {
      properties.itemName = params.name;
    }

    if (hasArtist.includes(type)) {
      if ("artist" in params) {
        properties.itemMadeBy = params.artist;
      }
    }

    if ("duration" in params) {
      if (params.start) {
        if (params.end) {
          properties.duration = end - start;
        } else {
          properties.duration = params.duration - start;
        }
      } else if (params.end) {
        properties.duration = end;
      } else {
        properties.duration = params.duration;
      }
    } else {
      properties.duration = null; // Not provided
    }

    this.setState(function (state, props) {
      return properties;
    });
  }

  changePos(ev, newVal) {
    console.log("Position changed to", newVal);
    this.setState(function (state, props) {
      return {
        position: newVal
      };
    });
  }

  updateDuration(time) {
    // Sometimes duration can be found afterwards
    this.setState(function (state, props) {
      return {
        itemDuration: time
      };
    });
  } // User Drag Handlers
  // TODO: Account for touch displays???


  userDragStart(ev) {
    this.setState(function (state, props) {
      return {
        userDragging: true
      };
    });
  }

  userDragEnd(ev) {
    this.setState(function (state, props) {
      return {
        userDragging: false
      };
    });
    this.state.controller.emit("setPosition", this.state.position);
  } // ! Main Rendering Code


  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "player"
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      container: true,
      spacing: 2
    }, /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 2
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, this.state.enabled ? _utils.localizedFuncs[i18n.getLocale()].formatDuration(this.state.position) : i18n.__("Idle Duration"))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 8
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "playback-progress",
      onPointerDown: this.userDragStart.bind(this),
      onPointerUp: this.userDragEnd.bind(this)
    }, /*#__PURE__*/_react.default.createElement(_Slider.default, {
      value: this.state.position,
      onChange: this.changePos.bind(this),
      "aria-labelledby": "continuous-slider",
      min: 0,
      max: this.state.length,
      disabled: !this.state.enabled
    }))), /*#__PURE__*/_react.default.createElement(_Grid.default, {
      item: true,
      xs: 2
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "caption"
    }, this.state.enabled ? "-" + _utils.localizedFuncs[i18n.getLocale()].formatDuration(Math.abs(this.state.itemLength - this.state.position)) : i18n.__("Idle Duration")))), /*#__PURE__*/_react.default.createElement("span", {
      className: _playerModule.default.playerTitle
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h5"
    }, this.state.itemName)), /*#__PURE__*/_react.default.createElement("span", {
      className: _playerModule.default.playerItemMadeBy
    }, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h6"
    }, this.state.itemMadeBy))));
  }

}

exports.PlayerComponent = PlayerComponent;
console.log("Imported styles", _playerModule.default);
},{"./player.module.css":"player.module.css","./utils.js":"utils.js"}],"prefdefaults.json":[function(require,module,exports) {
module.exports = {
  "pageSize": 25,
  "snackbarAutoHideDuration": 5000,
  "test": true,
  "enabledContentHandlers": ["./static/modules/contenthandlers/youtube"],
  "youtubePlayerMethod": "./static/modules/youtube_embed_iframe",
  "fallbackYoutubePlayerMethod": "browserView",
  "adblock": true,
  "adblock-file": "easylist.blocklist",
  "adblock-download-list": "http://easylist.to/easylist/easylist.txt",
  "cookie-obliterator": false,
  "initialWindowHeight": 600,
  "initialWindowWidth": 800
};
},{}],"unbundle.js":[function(require,module,exports) {
"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _lab = require("@material-ui/lab");

var _core = require("@material-ui/core");

var _CssBaseline = _interopRequireDefault(require("@material-ui/core/CssBaseline"));

var _useMediaQuery = _interopRequireDefault(require("@material-ui/core/useMediaQuery"));

var _styles = require("@material-ui/core/styles");

var _Menu = _interopRequireDefault(require("@material-ui/icons/Menu"));

var _Storage = _interopRequireDefault(require("@material-ui/icons/Storage"));

var _MusicNote = _interopRequireDefault(require("@material-ui/icons/MusicNote"));

var _HomeRounded = _interopRequireDefault(require("@material-ui/icons/HomeRounded"));

var _Settings = _interopRequireDefault(require("@material-ui/icons/Settings"));

var _Paper = _interopRequireDefault(require("@material-ui/core/Paper"));

var _AppBar = _interopRequireDefault(require("@material-ui/core/AppBar"));

var _Drawer = _interopRequireDefault(require("@material-ui/core/Drawer"));

var _IconButton = _interopRequireDefault(require("@material-ui/core/IconButton"));

var _Switch = _interopRequireDefault(require("@material-ui/core/Switch"));

var _Toolbar = _interopRequireDefault(require("@material-ui/core/Toolbar"));

var _MenuItem = _interopRequireDefault(require("@material-ui/core/MenuItem"));

var _Menu2 = _interopRequireDefault(require("@material-ui/core/Menu"));

var _Typography = _interopRequireDefault(require("@material-ui/core/Typography"));

var _List = _interopRequireDefault(require("@material-ui/core/List"));

var _Divider = _interopRequireDefault(require("@material-ui/core/Divider"));

var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));

var _Snackbar = _interopRequireDefault(require("@material-ui/core/Snackbar"));

var _ButtonBase = _interopRequireDefault(require("@material-ui/core/ButtonBase"));

var _TouchRipple = _interopRequireDefault(require("@material-ui/core/ButtonBase/TouchRipple"));

var _Alert = _interopRequireDefault(require("@material-ui/lab/Alert"));

var _ListItem = _interopRequireDefault(require("@material-ui/core/ListItem"));

var _ListItemIcon = _interopRequireDefault(require("@material-ui/core/ListItemIcon"));

var _ListItemText = _interopRequireDefault(require("@material-ui/core/ListItemText"));

var _Table = _interopRequireDefault(require("@material-ui/core/Table"));

var _TableBody = _interopRequireDefault(require("@material-ui/core/TableBody"));

var _TableCell = _interopRequireDefault(require("@material-ui/core/TableCell"));

var _TableContainer = _interopRequireDefault(require("@material-ui/core/TableContainer"));

var _TableHead = _interopRequireDefault(require("@material-ui/core/TableHead"));

var _TableRow = _interopRequireDefault(require("@material-ui/core/TableRow"));

var _clsx = _interopRequireDefault(require("clsx"));

var _player = require("./player");

var _prefdefaults = _interopRequireDefault(require("./prefdefaults.json"));

var _utils = require("./utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const EventEmitter = require('events'); // Reusable Player Componoent


const Store = require("electron-store"); // Settings Loading


if (!Store) {
  console.warn("NO STORE found");
}

const settings = new Store({
  defaults: _prefdefaults.default
}); // Constants

const songViewHeaders = ["Song Name", "Artist", "Duration"]; //import {$} from "jquery";

const $ = require("jquery");

const regeneratorRuntime = require("regenerator-runtime");

console.log("bundle :D");
// Constants
const documentID = Math.floor(Math.random() * 100000).toString();
let musicServer = "http://localhost:3000"; // NO SLASH!

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
} // https://material-ui.com/components/snackbars/


function Alert(props) {
  return /*#__PURE__*/_react.default.createElement(_Alert.default, _extends({
    elevation: 6,
    variant: "filled"
  }, props));
}

function placeholder(item, key) {
  return /*#__PURE__*/_react.default.createElement(_lab.Skeleton, {
    animation: "wave",
    key: key
  });
}

class ResultView extends _react.default.PureComponent {
  constructor(props) {
    super(props); // Deprecated but needed anyway

    this.state = {
      pageIndex: 0,
      type: props.type,
      pageData: [],
      connectionFailedSnackbarOpen: false,
      columns: 3
    };

    if (props.columns) {
      this.state.columns = props.columns;
    }

    if (props.columnHeaders) {
      this.state.colHeaders = props.columnHeaders.map(unlocalizedName => i18n.__(unlocalizedName));
    } else {
      this.state.colHeaders = new Array(this.state.columns).map(something => i18n.__("Unknown Header"));
    }

    this.search.bind(this)();
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

  hideConnectionFailureSnackbar() {
    this.setState(function (state, props) {
      return {
        connectionFailedSnackbarOpen: false
      };
    });
  }

  showConnectionFailureSnackbar() {
    this.setState(function (state, props) {
      return {
        connectionFailedSnackbarOpen: true
      };
    });
  }

  handleConnectionFailureSnackbarClose(event, reason) {
    if (reason == "clickaway") {
      return;
    }

    this.hideConnectionFailureSnackbar();
  }

  async search() {
    console.log("Running Search Request");
    let pageSize = settings.get("pageSize");

    try {
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
    } catch (ex) {
      console.log("Connection failed: showing connection failure snackbar", ex);
      this.showConnectionFailureSnackbar();
      return;
    }
  }

  onRowClickActivator(index) {
    this.props.onRowClick(this.state.pageData[index], index);
  }

  render() {
    let outerThis = this;

    function colgenerator(item, index) {
      let cols = [];

      for (let i = 0; i < this.state.columns; i++) {
        let elem = /*#__PURE__*/_react.default.createElement(_TableCell.default, {
          align: "left",
          key: i
        }, outerThis.props.renderCols(item, i));

        cols.push(elem);
      }

      return /*#__PURE__*/_react.default.createElement(_TableRow.default, {
        key: index,
        onClick: this.onRowClickActivator.bind(this, index)
      }, cols);
    }

    let comps = this.state.pageData.map(colgenerator.bind(this));
    let tableHead = [];

    for (let i = 0; i < this.state.columns; i++) {
      tableHead.push( /*#__PURE__*/_react.default.createElement(_TableCell.default, {
        key: i,
        align: "left"
      }, this.state.colHeaders[i]));
    }

    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      className: "results-wrapper"
    }, /*#__PURE__*/_react.default.createElement(_TableContainer.default, {
      component: _Paper.default
    }, /*#__PURE__*/_react.default.createElement(_Table.default, null, /*#__PURE__*/_react.default.createElement(_TableHead.default, null, /*#__PURE__*/_react.default.createElement(_TableRow.default, null, tableHead)), /*#__PURE__*/_react.default.createElement(_TableBody.default, null, comps))), /*#__PURE__*/_react.default.createElement("p", null, i18n.__("Showing "), this.state.pageData.length, " ", i18n.__(" items"), ";")), /*#__PURE__*/_react.default.createElement(_Snackbar.default, {
      open: this.state.connectionFailedSnackbarOpen,
      autoHideDuration: settings.get("snackbarAutoHideDuration"),
      onClose: this.handleConnectionFailureSnackbarClose.bind(this)
    }, /*#__PURE__*/_react.default.createElement(Alert, {
      onClose: this.handleConnectionFailureSnackbarClose.bind(this),
      severity: "error"
    }, i18n.__("Unable to establish connection to media provider"))));
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

  onItemClick(e) {
    console.log("Item Click", e, this);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_TextField.default, {
      type: "text",
      className: "searchbox",
      onChange: this.fetchSearch.bind(this),
      label: i18n.__("Type to search"),
      fullWidth: true
    }), /*#__PURE__*/_react.default.createElement(ResultView, {
      type: "playlists",
      query: this.state.searchBoxValue,
      onItemClick: this.onItemClick.bind(this)
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

  createSongNameCol(item, key) {
    // TODO: NOT USE INLINE STYLES
    return /*#__PURE__*/_react.default.createElement("div", {
      key: key
    }, /*#__PURE__*/_react.default.createElement(_IconButton.default, null, /*#__PURE__*/_react.default.createElement(_MusicNote.default, null)), item.name);
  }

  createSongArtistCol(item, key) {
    return /*#__PURE__*/_react.default.createElement("div", null, item.artist);
  }

  createDurationCol(item, key) {
    return /*#__PURE__*/_react.default.createElement("div", null, _utils.localizedFuncs[i18n.getLocale()].formatDuration(item.duration));
  }

  renderCols(item, index, classes) {
    let colGenerators = [this.createSongNameCol.bind(this), this.createSongArtistCol.bind(this), this.createDurationCol.bind(this)]; // TODO: Not hardcode this here

    return colGenerators[index](item, index); // Execute column generator function with the index
  }

  handleRowClick(rowData, index) {
    console.log(rowData);
    this.props.controller.emit("playSong", rowData);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_TextField.default, {
      type: "text",
      className: "searchbox",
      onChange: this.fetchSearch.bind(this),
      label: i18n.__("Type to search"),
      fullWidth: true
    }), /*#__PURE__*/_react.default.createElement(ResultView, {
      type: "songs",
      query: this.state.searchBoxValue,
      renderCols: this.renderCols.bind(this),
      columnHeaders: songViewHeaders,
      onRowClick: this.handleRowClick.bind(this)
    }), /*#__PURE__*/_react.default.createElement("p", null, i18n.__("Current querying "), " ", settings.get("pageSize"), " ", i18n.__(" songs matching the query "), " ", this.state.searchBoxValue), /*#__PURE__*/_react.default.createElement("div", null));
  }

} // Home View
// TODO: Populate with intresting things


class HomeComponent extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {// Code to run when component is destoryed -> constructor
  }

  componentWillUnmount() {// Componoent dies -> deconstructor
  }

  stateChange() {
    this.setState(function (state, props) {
      return {};
    });
  }

  render() {
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h3"
    }, i18n.__("Hello! This is the default homescreen for now. ")));
  }

} // Drawer


class MainDrawerComponent extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  triggerView(viewName) {
    return (event => this.props.setCurView(viewName)).bind(this);
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", {
      onClick: this.props.drawerToggle
    }, /*#__PURE__*/_react.default.createElement(_List.default, null, /*#__PURE__*/_react.default.createElement(_ListItem.default, null, /*#__PURE__*/_react.default.createElement(_Typography.default, {
      variant: "h3"
    }, i18n.__("App Name"))), /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      button: true,
      onClick: this.triggerView("homeview")
    }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_HomeRounded.default, null)), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primary: "Home"
    })), /*#__PURE__*/_react.default.createElement(_Divider.default, null), /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      button: true,
      onClick: this.triggerView("songs")
    }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_MusicNote.default, null)), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primary: i18n.__("Songs")
    })), /*#__PURE__*/_react.default.createElement(_ListItem.default, {
      button: true,
      onClick: this.triggerView("settings")
    }, /*#__PURE__*/_react.default.createElement(_ListItemIcon.default, null, /*#__PURE__*/_react.default.createElement(_Settings.default, null)), /*#__PURE__*/_react.default.createElement(_ListItemText.default, {
      primary: i18n.__("Settings")
    }))));
  }

} // Main Comp


function MainComponent() {
  // Theme Logic
  let useDarkMode = (0, _useMediaQuery.default)("(prefers-color-scheme: dark)");

  if (settings.get("useDarkMode")) {
    useDarkMode = settings.get("useDarkMode");
  }

  const theme = _react.default.useMemo(() => (0, _styles.createMuiTheme)({
    palette: {
      type: useDarkMode ? "dark" : "light"
    }
  }), [useDarkMode]); // Handle Menu Logic


  let [serversAnchorEl, setServersAnchorEl] = _react.default.useState(null);

  let [drawerOpen, setDrawerOpen] = _react.default.useState(false);

  function toggleDrawer(event) {
    setDrawerOpen(!drawerOpen);
  }

  function handleMenu(event) {
    console.log(this);
    setServersAnchorEl(event.target);
  }

  function handleClose(event) {
    console.log(this);
    setServersAnchorEl(null);
  } //let [open] = React.useState(true);
  // Current View


  let [curView, setCurView] = _react.default.useState("homeview");

  const serversOpen = Boolean(serversAnchorEl);

  const [controller, changeController] = _react.default.useState(new EventEmitter()); // Legacy Views System


  let views = {};
  views.playlists = /*#__PURE__*/_react.default.createElement(PlaylistView, null);
  views.songs = /*#__PURE__*/_react.default.createElement(SongView, {
    controller: controller
  });
  views.homeview = /*#__PURE__*/_react.default.createElement(HomeComponent, null);
  window.debug = {};
  window.debug.views = views;
  const stylesSet = (0, _styles.makeStyles)(theme => ({
    root: {
      flexGrow: 1
    },
    title: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    }
  }));
  const classes = stylesSet();
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_styles.ThemeProvider, {
    theme: theme
  }, /*#__PURE__*/_react.default.createElement(_CssBaseline.default, null), /*#__PURE__*/_react.default.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/_react.default.createElement(_Drawer.default, {
    anchor: "left",
    open: drawerOpen,
    onClick: toggleDrawer
  }, /*#__PURE__*/_react.default.createElement(MainDrawerComponent, {
    drawerToggle: toggleDrawer,
    setCurView: setCurView
  })), /*#__PURE__*/_react.default.createElement(_AppBar.default, {
    position: "static"
  }, /*#__PURE__*/_react.default.createElement(_Toolbar.default, null, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    edge: "start",
    className: classes.menuButton,
    color: "inherit",
    "aria-label": "menu",
    onClick: toggleDrawer
  }, /*#__PURE__*/_react.default.createElement(_Menu.default, null)), /*#__PURE__*/_react.default.createElement(_Typography.default, {
    variant: "h6",
    className: classes.title
  }, i18n.__("App Name")), /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_IconButton.default, {
    color: "inherit",
    "aria-label": "Switch Media Server",
    "aria-controls": "menu-appbar",
    "aria-haspopup": "true",
    onClick: handleMenu
  }, /*#__PURE__*/_react.default.createElement(_Storage.default, null)), /*#__PURE__*/_react.default.createElement(_Menu2.default, {
    id: "menu-appbar",
    anchorEl: serversAnchorEl,
    anchorOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    keepMounted: true,
    transformOrigin: {
      vertical: "top",
      horizontal: "right"
    },
    onClose: handleClose,
    open: serversOpen
  }, /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    onClick: setServer
  }, "Local"), /*#__PURE__*/_react.default.createElement(_MenuItem.default, {
    onClick: setServer
  }, "Add new server"))))), /*#__PURE__*/_react.default.createElement(_core.Container, {
    maxWidth: "md"
  }, views[curView]), /*#__PURE__*/_react.default.createElement(_player.PlayerComponent, {
    settings: settings,
    controller: controller
  }))));
} // Bootstrap code
// really odd part i'm learning


function setServer(comp) {}

$(function () {
  // TODO: Replace with Vanilla JS to make script size smaller
  _reactDom.default.render( /*#__PURE__*/_react.default.createElement(MainComponent, null), document.getElementById("root"));
});
console.log("Player Comp", _player.PlayerComponent);
},{"./player":"player.js","./prefdefaults.json":"prefdefaults.json","./utils.js":"utils.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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