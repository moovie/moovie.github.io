(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Moovie = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function mune(keys) {
  return keys && typeof keys === 'object' ? (
    Array.isArray(keys) ? keys : Object.keys(keys)
  ).reduce(function (mune, val) {
    mune[val] = val
    return mune
  }, {}) : {}
}

},{}],2:[function(require,module,exports){
/*!
* screenfull
* v3.0.0 - 2015-11-24
* (c) Sindre Sorhus; MIT License
*/
(function () {
	'use strict';

	var isCommonjs = typeof module !== 'undefined' && module.exports;
	var keyboardAllowed = typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element;

	var fn = (function () {
		var val;
		var valLength;

		var fnMap = [
			[
				'requestFullscreen',
				'exitFullscreen',
				'fullscreenElement',
				'fullscreenEnabled',
				'fullscreenchange',
				'fullscreenerror'
			],
			// new WebKit
			[
				'webkitRequestFullscreen',
				'webkitExitFullscreen',
				'webkitFullscreenElement',
				'webkitFullscreenEnabled',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			// old WebKit (Safari 5.1)
			[
				'webkitRequestFullScreen',
				'webkitCancelFullScreen',
				'webkitCurrentFullScreenElement',
				'webkitCancelFullScreen',
				'webkitfullscreenchange',
				'webkitfullscreenerror'

			],
			[
				'mozRequestFullScreen',
				'mozCancelFullScreen',
				'mozFullScreenElement',
				'mozFullScreenEnabled',
				'mozfullscreenchange',
				'mozfullscreenerror'
			],
			[
				'msRequestFullscreen',
				'msExitFullscreen',
				'msFullscreenElement',
				'msFullscreenEnabled',
				'MSFullscreenChange',
				'MSFullscreenError'
			]
		];

		var i = 0;
		var l = fnMap.length;
		var ret = {};

		for (; i < l; i++) {
			val = fnMap[i];
			if (val && val[1] in document) {
				for (i = 0, valLength = val.length; i < valLength; i++) {
					ret[fnMap[0][i]] = val[i];
				}
				return ret;
			}
		}

		return false;
	})();

	var screenfull = {
		request: function (elem) {
			var request = fn.requestFullscreen;

			elem = elem || document.documentElement;

			// Work around Safari 5.1 bug: reports support for
			// keyboard in fullscreen even though it doesn't.
			// Browser sniffing, since the alternative with
			// setTimeout is even worse.
			if (/5\.1[\.\d]* Safari/.test(navigator.userAgent)) {
				elem[request]();
			} else {
				elem[request](keyboardAllowed && Element.ALLOW_KEYBOARD_INPUT);
			}
		},
		exit: function () {
			document[fn.exitFullscreen]();
		},
		toggle: function (elem) {
			if (this.isFullscreen) {
				this.exit();
			} else {
				this.request(elem);
			}
		},
		raw: fn
	};

	if (!fn) {
		if (isCommonjs) {
			module.exports = false;
		} else {
			window.screenfull = false;
		}

		return;
	}

	Object.defineProperties(screenfull, {
		isFullscreen: {
			get: function () {
				return Boolean(document[fn.fullscreenElement]);
			}
		},
		element: {
			enumerable: true,
			get: function () {
				return document[fn.fullscreenElement];
			}
		},
		enabled: {
			enumerable: true,
			get: function () {
				// Coerce to boolean in case of old WebKit
				return Boolean(document[fn.fullscreenEnabled]);
			}
		}
	});

	if (isCommonjs) {
		module.exports = screenfull;
	} else {
		window.screenfull = screenfull;
	}
})();

},{}],3:[function(require,module,exports){
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Default exports for Node. Export the extended versions of VTTCue and
// VTTRegion in Node since we likely want the capability to convert back and
// forth between JSON. If we don't then it's not that big of a deal since we're
// off browser.
module.exports = {
  WebVTT: require("./vtt.js").WebVTT,
  VTTCue: require("./vttcue-extended.js").VTTCue,
  VTTRegion: require("./vttregion-extended.js").VTTRegion
};

},{"./vtt.js":4,"./vttcue-extended.js":5,"./vttregion-extended.js":7}],4:[function(require,module,exports){
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

(function(global) {

  var _objCreate = Object.create || (function() {
    function F() {}
    return function(o) {
      if (arguments.length !== 1) {
        throw new Error('Object.create shim only accepts one parameter.');
      }
      F.prototype = o;
      return new F();
    };
  })();

  // Creates a new ParserError object from an errorData object. The errorData
  // object should have default code and message properties. The default message
  // property can be overriden by passing in a message parameter.
  // See ParsingError.Errors below for acceptable errors.
  function ParsingError(errorData, message) {
    this.name = "ParsingError";
    this.code = errorData.code;
    this.message = message || errorData.message;
  }
  ParsingError.prototype = _objCreate(Error.prototype);
  ParsingError.prototype.constructor = ParsingError;

  // ParsingError metadata for acceptable ParsingErrors.
  ParsingError.Errors = {
    BadSignature: {
      code: 0,
      message: "Malformed WebVTT signature."
    },
    BadTimeStamp: {
      code: 1,
      message: "Malformed time stamp."
    }
  };

  // Try to parse input as a time stamp.
  function parseTimeStamp(input) {

    function computeSeconds(h, m, s, f) {
      return (h | 0) * 3600 + (m | 0) * 60 + (s | 0) + (f | 0) / 1000;
    }

    var m = input.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
    if (!m) {
      return null;
    }

    if (m[3]) {
      // Timestamp takes the form of [hours]:[minutes]:[seconds].[milliseconds]
      return computeSeconds(m[1], m[2], m[3].replace(":", ""), m[4]);
    } else if (m[1] > 59) {
      // Timestamp takes the form of [hours]:[minutes].[milliseconds]
      // First position is hours as it's over 59.
      return computeSeconds(m[1], m[2], 0,  m[4]);
    } else {
      // Timestamp takes the form of [minutes]:[seconds].[milliseconds]
      return computeSeconds(0, m[1], m[2], m[4]);
    }
  }

  // A settings object holds key/value pairs and will ignore anything but the first
  // assignment to a specific key.
  function Settings() {
    this.values = _objCreate(null);
  }

  Settings.prototype = {
    // Only accept the first assignment to any key.
    set: function(k, v) {
      if (!this.get(k) && v !== "") {
        this.values[k] = v;
      }
    },
    // Return the value for a key, or a default value.
    // If 'defaultKey' is passed then 'dflt' is assumed to be an object with
    // a number of possible default values as properties where 'defaultKey' is
    // the key of the property that will be chosen; otherwise it's assumed to be
    // a single value.
    get: function(k, dflt, defaultKey) {
      if (defaultKey) {
        return this.has(k) ? this.values[k] : dflt[defaultKey];
      }
      return this.has(k) ? this.values[k] : dflt;
    },
    // Check whether we have a value for a key.
    has: function(k) {
      return k in this.values;
    },
    // Accept a setting if its one of the given alternatives.
    alt: function(k, v, a) {
      for (var n = 0; n < a.length; ++n) {
        if (v === a[n]) {
          this.set(k, v);
          break;
        }
      }
    },
    // Accept a setting if its a valid (signed) integer.
    integer: function(k, v) {
      if (/^-?\d+$/.test(v)) { // integer
        this.set(k, parseInt(v, 10));
      }
    },
    // Accept a setting if its a valid percentage.
    percent: function(k, v) {
      var m;
      if ((m = v.match(/^([\d]{1,3})(\.[\d]*)?%$/))) {
        v = parseFloat(v);
        if (v >= 0 && v <= 100) {
          this.set(k, v);
          return true;
        }
      }
      return false;
    }
  };

  // Helper function to parse input into groups separated by 'groupDelim', and
  // interprete each group as a key/value pair separated by 'keyValueDelim'.
  function parseOptions(input, callback, keyValueDelim, groupDelim) {
    var groups = groupDelim ? input.split(groupDelim) : [input];
    for (var i in groups) {
      if (typeof groups[i] !== "string") {
        continue;
      }
      var kv = groups[i].split(keyValueDelim);
      if (kv.length !== 2) {
        continue;
      }
      var k = kv[0];
      var v = kv[1];
      callback(k, v);
    }
  }

  function parseCue(input, cue, regionList) {
    // Remember the original input if we need to throw an error.
    var oInput = input;
    // 4.1 WebVTT timestamp
    function consumeTimeStamp() {
      var ts = parseTimeStamp(input);
      if (ts === null) {
        throw new ParsingError(ParsingError.Errors.BadTimeStamp,
                              "Malformed timestamp: " + oInput);
      }
      // Remove time stamp from input.
      input = input.replace(/^[^\sa-zA-Z-]+/, "");
      return ts;
    }

    // 4.4.2 WebVTT cue settings
    function consumeCueSettings(input, cue) {
      var settings = new Settings();

      parseOptions(input, function (k, v) {
        switch (k) {
        case "region":
          // Find the last region we parsed with the same region id.
          for (var i = regionList.length - 1; i >= 0; i--) {
            if (regionList[i].id === v) {
              settings.set(k, regionList[i].region);
              break;
            }
          }
          break;
        case "vertical":
          settings.alt(k, v, ["rl", "lr"]);
          break;
        case "line":
          var vals = v.split(","),
              vals0 = vals[0];
          settings.integer(k, vals0);
          settings.percent(k, vals0) ? settings.set("snapToLines", false) : null;
          settings.alt(k, vals0, ["auto"]);
          if (vals.length === 2) {
            settings.alt("lineAlign", vals[1], ["start", "middle", "end"]);
          }
          break;
        case "position":
          vals = v.split(",");
          settings.percent(k, vals[0]);
          if (vals.length === 2) {
            settings.alt("positionAlign", vals[1], ["start", "middle", "end"]);
          }
          break;
        case "size":
          settings.percent(k, v);
          break;
        case "align":
          settings.alt(k, v, ["start", "middle", "end", "left", "right"]);
          break;
        }
      }, /:/, /\s/);

      // Apply default values for any missing fields.
      cue.region = settings.get("region", null);
      cue.vertical = settings.get("vertical", "");
      cue.line = settings.get("line", "auto");
      cue.lineAlign = settings.get("lineAlign", "start");
      cue.snapToLines = settings.get("snapToLines", true);
      cue.size = settings.get("size", 100);
      cue.align = settings.get("align", "middle");
      cue.position = settings.get("position", {
        start: 0,
        left: 0,
        middle: 50,
        end: 100,
        right: 100
      }, cue.align);
      cue.positionAlign = settings.get("positionAlign", {
        start: "start",
        left: "start",
        middle: "middle",
        end: "end",
        right: "end"
      }, cue.align);
    }

    function skipWhitespace() {
      input = input.replace(/^\s+/, "");
    }

    // 4.1 WebVTT cue timings.
    skipWhitespace();
    cue.startTime = consumeTimeStamp();   // (1) collect cue start time
    skipWhitespace();
    if (input.substr(0, 3) !== "-->") {     // (3) next characters must match "-->"
      throw new ParsingError(ParsingError.Errors.BadTimeStamp,
                             "Malformed time stamp (time stamps must be separated by '-->'): " +
                             oInput);
    }
    input = input.substr(3);
    skipWhitespace();
    cue.endTime = consumeTimeStamp();     // (5) collect cue end time

    // 4.1 WebVTT cue settings list.
    skipWhitespace();
    consumeCueSettings(input, cue);
  }

  var ESCAPE = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&lrm;": "\u200e",
    "&rlm;": "\u200f",
    "&nbsp;": "\u00a0"
  };

  var TAG_NAME = {
    c: "span",
    i: "i",
    b: "b",
    u: "u",
    ruby: "ruby",
    rt: "rt",
    v: "span",
    lang: "span"
  };

  var TAG_ANNOTATION = {
    v: "title",
    lang: "lang"
  };

  var NEEDS_PARENT = {
    rt: "ruby"
  };

  // Parse content into a document fragment.
  function parseContent(window, input) {
    function nextToken() {
      // Check for end-of-string.
      if (!input) {
        return null;
      }

      // Consume 'n' characters from the input.
      function consume(result) {
        input = input.substr(result.length);
        return result;
      }

      var m = input.match(/^([^<]*)(<[^>]+>?)?/);
      // If there is some text before the next tag, return it, otherwise return
      // the tag.
      return consume(m[1] ? m[1] : m[2]);
    }

    // Unescape a string 's'.
    function unescape1(e) {
      return ESCAPE[e];
    }
    function unescape(s) {
      while ((m = s.match(/&(amp|lt|gt|lrm|rlm|nbsp);/))) {
        s = s.replace(m[0], unescape1);
      }
      return s;
    }

    function shouldAdd(current, element) {
      return !NEEDS_PARENT[element.localName] ||
             NEEDS_PARENT[element.localName] === current.localName;
    }

    // Create an element for this tag.
    function createElement(type, annotation) {
      var tagName = TAG_NAME[type];
      if (!tagName) {
        return null;
      }
      var element = window.document.createElement(tagName);
      element.localName = tagName;
      var name = TAG_ANNOTATION[type];
      if (name && annotation) {
        element[name] = annotation.trim();
      }
      return element;
    }

    var rootDiv = window.document.createElement("div"),
        current = rootDiv,
        t,
        tagStack = [];

    while ((t = nextToken()) !== null) {
      if (t[0] === '<') {
        if (t[1] === "/") {
          // If the closing tag matches, move back up to the parent node.
          if (tagStack.length &&
              tagStack[tagStack.length - 1] === t.substr(2).replace(">", "")) {
            tagStack.pop();
            current = current.parentNode;
          }
          // Otherwise just ignore the end tag.
          continue;
        }
        var ts = parseTimeStamp(t.substr(1, t.length - 2));
        var node;
        if (ts) {
          // Timestamps are lead nodes as well.
          node = window.document.createProcessingInstruction("timestamp", ts);
          current.appendChild(node);
          continue;
        }
        var m = t.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
        // If we can't parse the tag, skip to the next tag.
        if (!m) {
          continue;
        }
        // Try to construct an element, and ignore the tag if we couldn't.
        node = createElement(m[1], m[3]);
        if (!node) {
          continue;
        }
        // Determine if the tag should be added based on the context of where it
        // is placed in the cuetext.
        if (!shouldAdd(current, node)) {
          continue;
        }
        // Set the class list (as a list of classes, separated by space).
        if (m[2]) {
          node.className = m[2].substr(1).replace('.', ' ');
        }
        // Append the node to the current node, and enter the scope of the new
        // node.
        tagStack.push(m[1]);
        current.appendChild(node);
        current = node;
        continue;
      }

      // Text nodes are leaf nodes.
      current.appendChild(window.document.createTextNode(unescape(t)));
    }

    return rootDiv;
  }

  // This is a list of all the Unicode characters that have a strong
  // right-to-left category. What this means is that these characters are
  // written right-to-left for sure. It was generated by pulling all the strong
  // right-to-left characters out of the Unicode data table. That table can
  // found at: http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
  var strongRTLChars = [0x05BE, 0x05C0, 0x05C3, 0x05C6, 0x05D0, 0x05D1,
      0x05D2, 0x05D3, 0x05D4, 0x05D5, 0x05D6, 0x05D7, 0x05D8, 0x05D9, 0x05DA,
      0x05DB, 0x05DC, 0x05DD, 0x05DE, 0x05DF, 0x05E0, 0x05E1, 0x05E2, 0x05E3,
      0x05E4, 0x05E5, 0x05E6, 0x05E7, 0x05E8, 0x05E9, 0x05EA, 0x05F0, 0x05F1,
      0x05F2, 0x05F3, 0x05F4, 0x0608, 0x060B, 0x060D, 0x061B, 0x061E, 0x061F,
      0x0620, 0x0621, 0x0622, 0x0623, 0x0624, 0x0625, 0x0626, 0x0627, 0x0628,
      0x0629, 0x062A, 0x062B, 0x062C, 0x062D, 0x062E, 0x062F, 0x0630, 0x0631,
      0x0632, 0x0633, 0x0634, 0x0635, 0x0636, 0x0637, 0x0638, 0x0639, 0x063A,
      0x063B, 0x063C, 0x063D, 0x063E, 0x063F, 0x0640, 0x0641, 0x0642, 0x0643,
      0x0644, 0x0645, 0x0646, 0x0647, 0x0648, 0x0649, 0x064A, 0x066D, 0x066E,
      0x066F, 0x0671, 0x0672, 0x0673, 0x0674, 0x0675, 0x0676, 0x0677, 0x0678,
      0x0679, 0x067A, 0x067B, 0x067C, 0x067D, 0x067E, 0x067F, 0x0680, 0x0681,
      0x0682, 0x0683, 0x0684, 0x0685, 0x0686, 0x0687, 0x0688, 0x0689, 0x068A,
      0x068B, 0x068C, 0x068D, 0x068E, 0x068F, 0x0690, 0x0691, 0x0692, 0x0693,
      0x0694, 0x0695, 0x0696, 0x0697, 0x0698, 0x0699, 0x069A, 0x069B, 0x069C,
      0x069D, 0x069E, 0x069F, 0x06A0, 0x06A1, 0x06A2, 0x06A3, 0x06A4, 0x06A5,
      0x06A6, 0x06A7, 0x06A8, 0x06A9, 0x06AA, 0x06AB, 0x06AC, 0x06AD, 0x06AE,
      0x06AF, 0x06B0, 0x06B1, 0x06B2, 0x06B3, 0x06B4, 0x06B5, 0x06B6, 0x06B7,
      0x06B8, 0x06B9, 0x06BA, 0x06BB, 0x06BC, 0x06BD, 0x06BE, 0x06BF, 0x06C0,
      0x06C1, 0x06C2, 0x06C3, 0x06C4, 0x06C5, 0x06C6, 0x06C7, 0x06C8, 0x06C9,
      0x06CA, 0x06CB, 0x06CC, 0x06CD, 0x06CE, 0x06CF, 0x06D0, 0x06D1, 0x06D2,
      0x06D3, 0x06D4, 0x06D5, 0x06E5, 0x06E6, 0x06EE, 0x06EF, 0x06FA, 0x06FB,
      0x06FC, 0x06FD, 0x06FE, 0x06FF, 0x0700, 0x0701, 0x0702, 0x0703, 0x0704,
      0x0705, 0x0706, 0x0707, 0x0708, 0x0709, 0x070A, 0x070B, 0x070C, 0x070D,
      0x070F, 0x0710, 0x0712, 0x0713, 0x0714, 0x0715, 0x0716, 0x0717, 0x0718,
      0x0719, 0x071A, 0x071B, 0x071C, 0x071D, 0x071E, 0x071F, 0x0720, 0x0721,
      0x0722, 0x0723, 0x0724, 0x0725, 0x0726, 0x0727, 0x0728, 0x0729, 0x072A,
      0x072B, 0x072C, 0x072D, 0x072E, 0x072F, 0x074D, 0x074E, 0x074F, 0x0750,
      0x0751, 0x0752, 0x0753, 0x0754, 0x0755, 0x0756, 0x0757, 0x0758, 0x0759,
      0x075A, 0x075B, 0x075C, 0x075D, 0x075E, 0x075F, 0x0760, 0x0761, 0x0762,
      0x0763, 0x0764, 0x0765, 0x0766, 0x0767, 0x0768, 0x0769, 0x076A, 0x076B,
      0x076C, 0x076D, 0x076E, 0x076F, 0x0770, 0x0771, 0x0772, 0x0773, 0x0774,
      0x0775, 0x0776, 0x0777, 0x0778, 0x0779, 0x077A, 0x077B, 0x077C, 0x077D,
      0x077E, 0x077F, 0x0780, 0x0781, 0x0782, 0x0783, 0x0784, 0x0785, 0x0786,
      0x0787, 0x0788, 0x0789, 0x078A, 0x078B, 0x078C, 0x078D, 0x078E, 0x078F,
      0x0790, 0x0791, 0x0792, 0x0793, 0x0794, 0x0795, 0x0796, 0x0797, 0x0798,
      0x0799, 0x079A, 0x079B, 0x079C, 0x079D, 0x079E, 0x079F, 0x07A0, 0x07A1,
      0x07A2, 0x07A3, 0x07A4, 0x07A5, 0x07B1, 0x07C0, 0x07C1, 0x07C2, 0x07C3,
      0x07C4, 0x07C5, 0x07C6, 0x07C7, 0x07C8, 0x07C9, 0x07CA, 0x07CB, 0x07CC,
      0x07CD, 0x07CE, 0x07CF, 0x07D0, 0x07D1, 0x07D2, 0x07D3, 0x07D4, 0x07D5,
      0x07D6, 0x07D7, 0x07D8, 0x07D9, 0x07DA, 0x07DB, 0x07DC, 0x07DD, 0x07DE,
      0x07DF, 0x07E0, 0x07E1, 0x07E2, 0x07E3, 0x07E4, 0x07E5, 0x07E6, 0x07E7,
      0x07E8, 0x07E9, 0x07EA, 0x07F4, 0x07F5, 0x07FA, 0x0800, 0x0801, 0x0802,
      0x0803, 0x0804, 0x0805, 0x0806, 0x0807, 0x0808, 0x0809, 0x080A, 0x080B,
      0x080C, 0x080D, 0x080E, 0x080F, 0x0810, 0x0811, 0x0812, 0x0813, 0x0814,
      0x0815, 0x081A, 0x0824, 0x0828, 0x0830, 0x0831, 0x0832, 0x0833, 0x0834,
      0x0835, 0x0836, 0x0837, 0x0838, 0x0839, 0x083A, 0x083B, 0x083C, 0x083D,
      0x083E, 0x0840, 0x0841, 0x0842, 0x0843, 0x0844, 0x0845, 0x0846, 0x0847,
      0x0848, 0x0849, 0x084A, 0x084B, 0x084C, 0x084D, 0x084E, 0x084F, 0x0850,
      0x0851, 0x0852, 0x0853, 0x0854, 0x0855, 0x0856, 0x0857, 0x0858, 0x085E,
      0x08A0, 0x08A2, 0x08A3, 0x08A4, 0x08A5, 0x08A6, 0x08A7, 0x08A8, 0x08A9,
      0x08AA, 0x08AB, 0x08AC, 0x200F, 0xFB1D, 0xFB1F, 0xFB20, 0xFB21, 0xFB22,
      0xFB23, 0xFB24, 0xFB25, 0xFB26, 0xFB27, 0xFB28, 0xFB2A, 0xFB2B, 0xFB2C,
      0xFB2D, 0xFB2E, 0xFB2F, 0xFB30, 0xFB31, 0xFB32, 0xFB33, 0xFB34, 0xFB35,
      0xFB36, 0xFB38, 0xFB39, 0xFB3A, 0xFB3B, 0xFB3C, 0xFB3E, 0xFB40, 0xFB41,
      0xFB43, 0xFB44, 0xFB46, 0xFB47, 0xFB48, 0xFB49, 0xFB4A, 0xFB4B, 0xFB4C,
      0xFB4D, 0xFB4E, 0xFB4F, 0xFB50, 0xFB51, 0xFB52, 0xFB53, 0xFB54, 0xFB55,
      0xFB56, 0xFB57, 0xFB58, 0xFB59, 0xFB5A, 0xFB5B, 0xFB5C, 0xFB5D, 0xFB5E,
      0xFB5F, 0xFB60, 0xFB61, 0xFB62, 0xFB63, 0xFB64, 0xFB65, 0xFB66, 0xFB67,
      0xFB68, 0xFB69, 0xFB6A, 0xFB6B, 0xFB6C, 0xFB6D, 0xFB6E, 0xFB6F, 0xFB70,
      0xFB71, 0xFB72, 0xFB73, 0xFB74, 0xFB75, 0xFB76, 0xFB77, 0xFB78, 0xFB79,
      0xFB7A, 0xFB7B, 0xFB7C, 0xFB7D, 0xFB7E, 0xFB7F, 0xFB80, 0xFB81, 0xFB82,
      0xFB83, 0xFB84, 0xFB85, 0xFB86, 0xFB87, 0xFB88, 0xFB89, 0xFB8A, 0xFB8B,
      0xFB8C, 0xFB8D, 0xFB8E, 0xFB8F, 0xFB90, 0xFB91, 0xFB92, 0xFB93, 0xFB94,
      0xFB95, 0xFB96, 0xFB97, 0xFB98, 0xFB99, 0xFB9A, 0xFB9B, 0xFB9C, 0xFB9D,
      0xFB9E, 0xFB9F, 0xFBA0, 0xFBA1, 0xFBA2, 0xFBA3, 0xFBA4, 0xFBA5, 0xFBA6,
      0xFBA7, 0xFBA8, 0xFBA9, 0xFBAA, 0xFBAB, 0xFBAC, 0xFBAD, 0xFBAE, 0xFBAF,
      0xFBB0, 0xFBB1, 0xFBB2, 0xFBB3, 0xFBB4, 0xFBB5, 0xFBB6, 0xFBB7, 0xFBB8,
      0xFBB9, 0xFBBA, 0xFBBB, 0xFBBC, 0xFBBD, 0xFBBE, 0xFBBF, 0xFBC0, 0xFBC1,
      0xFBD3, 0xFBD4, 0xFBD5, 0xFBD6, 0xFBD7, 0xFBD8, 0xFBD9, 0xFBDA, 0xFBDB,
      0xFBDC, 0xFBDD, 0xFBDE, 0xFBDF, 0xFBE0, 0xFBE1, 0xFBE2, 0xFBE3, 0xFBE4,
      0xFBE5, 0xFBE6, 0xFBE7, 0xFBE8, 0xFBE9, 0xFBEA, 0xFBEB, 0xFBEC, 0xFBED,
      0xFBEE, 0xFBEF, 0xFBF0, 0xFBF1, 0xFBF2, 0xFBF3, 0xFBF4, 0xFBF5, 0xFBF6,
      0xFBF7, 0xFBF8, 0xFBF9, 0xFBFA, 0xFBFB, 0xFBFC, 0xFBFD, 0xFBFE, 0xFBFF,
      0xFC00, 0xFC01, 0xFC02, 0xFC03, 0xFC04, 0xFC05, 0xFC06, 0xFC07, 0xFC08,
      0xFC09, 0xFC0A, 0xFC0B, 0xFC0C, 0xFC0D, 0xFC0E, 0xFC0F, 0xFC10, 0xFC11,
      0xFC12, 0xFC13, 0xFC14, 0xFC15, 0xFC16, 0xFC17, 0xFC18, 0xFC19, 0xFC1A,
      0xFC1B, 0xFC1C, 0xFC1D, 0xFC1E, 0xFC1F, 0xFC20, 0xFC21, 0xFC22, 0xFC23,
      0xFC24, 0xFC25, 0xFC26, 0xFC27, 0xFC28, 0xFC29, 0xFC2A, 0xFC2B, 0xFC2C,
      0xFC2D, 0xFC2E, 0xFC2F, 0xFC30, 0xFC31, 0xFC32, 0xFC33, 0xFC34, 0xFC35,
      0xFC36, 0xFC37, 0xFC38, 0xFC39, 0xFC3A, 0xFC3B, 0xFC3C, 0xFC3D, 0xFC3E,
      0xFC3F, 0xFC40, 0xFC41, 0xFC42, 0xFC43, 0xFC44, 0xFC45, 0xFC46, 0xFC47,
      0xFC48, 0xFC49, 0xFC4A, 0xFC4B, 0xFC4C, 0xFC4D, 0xFC4E, 0xFC4F, 0xFC50,
      0xFC51, 0xFC52, 0xFC53, 0xFC54, 0xFC55, 0xFC56, 0xFC57, 0xFC58, 0xFC59,
      0xFC5A, 0xFC5B, 0xFC5C, 0xFC5D, 0xFC5E, 0xFC5F, 0xFC60, 0xFC61, 0xFC62,
      0xFC63, 0xFC64, 0xFC65, 0xFC66, 0xFC67, 0xFC68, 0xFC69, 0xFC6A, 0xFC6B,
      0xFC6C, 0xFC6D, 0xFC6E, 0xFC6F, 0xFC70, 0xFC71, 0xFC72, 0xFC73, 0xFC74,
      0xFC75, 0xFC76, 0xFC77, 0xFC78, 0xFC79, 0xFC7A, 0xFC7B, 0xFC7C, 0xFC7D,
      0xFC7E, 0xFC7F, 0xFC80, 0xFC81, 0xFC82, 0xFC83, 0xFC84, 0xFC85, 0xFC86,
      0xFC87, 0xFC88, 0xFC89, 0xFC8A, 0xFC8B, 0xFC8C, 0xFC8D, 0xFC8E, 0xFC8F,
      0xFC90, 0xFC91, 0xFC92, 0xFC93, 0xFC94, 0xFC95, 0xFC96, 0xFC97, 0xFC98,
      0xFC99, 0xFC9A, 0xFC9B, 0xFC9C, 0xFC9D, 0xFC9E, 0xFC9F, 0xFCA0, 0xFCA1,
      0xFCA2, 0xFCA3, 0xFCA4, 0xFCA5, 0xFCA6, 0xFCA7, 0xFCA8, 0xFCA9, 0xFCAA,
      0xFCAB, 0xFCAC, 0xFCAD, 0xFCAE, 0xFCAF, 0xFCB0, 0xFCB1, 0xFCB2, 0xFCB3,
      0xFCB4, 0xFCB5, 0xFCB6, 0xFCB7, 0xFCB8, 0xFCB9, 0xFCBA, 0xFCBB, 0xFCBC,
      0xFCBD, 0xFCBE, 0xFCBF, 0xFCC0, 0xFCC1, 0xFCC2, 0xFCC3, 0xFCC4, 0xFCC5,
      0xFCC6, 0xFCC7, 0xFCC8, 0xFCC9, 0xFCCA, 0xFCCB, 0xFCCC, 0xFCCD, 0xFCCE,
      0xFCCF, 0xFCD0, 0xFCD1, 0xFCD2, 0xFCD3, 0xFCD4, 0xFCD5, 0xFCD6, 0xFCD7,
      0xFCD8, 0xFCD9, 0xFCDA, 0xFCDB, 0xFCDC, 0xFCDD, 0xFCDE, 0xFCDF, 0xFCE0,
      0xFCE1, 0xFCE2, 0xFCE3, 0xFCE4, 0xFCE5, 0xFCE6, 0xFCE7, 0xFCE8, 0xFCE9,
      0xFCEA, 0xFCEB, 0xFCEC, 0xFCED, 0xFCEE, 0xFCEF, 0xFCF0, 0xFCF1, 0xFCF2,
      0xFCF3, 0xFCF4, 0xFCF5, 0xFCF6, 0xFCF7, 0xFCF8, 0xFCF9, 0xFCFA, 0xFCFB,
      0xFCFC, 0xFCFD, 0xFCFE, 0xFCFF, 0xFD00, 0xFD01, 0xFD02, 0xFD03, 0xFD04,
      0xFD05, 0xFD06, 0xFD07, 0xFD08, 0xFD09, 0xFD0A, 0xFD0B, 0xFD0C, 0xFD0D,
      0xFD0E, 0xFD0F, 0xFD10, 0xFD11, 0xFD12, 0xFD13, 0xFD14, 0xFD15, 0xFD16,
      0xFD17, 0xFD18, 0xFD19, 0xFD1A, 0xFD1B, 0xFD1C, 0xFD1D, 0xFD1E, 0xFD1F,
      0xFD20, 0xFD21, 0xFD22, 0xFD23, 0xFD24, 0xFD25, 0xFD26, 0xFD27, 0xFD28,
      0xFD29, 0xFD2A, 0xFD2B, 0xFD2C, 0xFD2D, 0xFD2E, 0xFD2F, 0xFD30, 0xFD31,
      0xFD32, 0xFD33, 0xFD34, 0xFD35, 0xFD36, 0xFD37, 0xFD38, 0xFD39, 0xFD3A,
      0xFD3B, 0xFD3C, 0xFD3D, 0xFD50, 0xFD51, 0xFD52, 0xFD53, 0xFD54, 0xFD55,
      0xFD56, 0xFD57, 0xFD58, 0xFD59, 0xFD5A, 0xFD5B, 0xFD5C, 0xFD5D, 0xFD5E,
      0xFD5F, 0xFD60, 0xFD61, 0xFD62, 0xFD63, 0xFD64, 0xFD65, 0xFD66, 0xFD67,
      0xFD68, 0xFD69, 0xFD6A, 0xFD6B, 0xFD6C, 0xFD6D, 0xFD6E, 0xFD6F, 0xFD70,
      0xFD71, 0xFD72, 0xFD73, 0xFD74, 0xFD75, 0xFD76, 0xFD77, 0xFD78, 0xFD79,
      0xFD7A, 0xFD7B, 0xFD7C, 0xFD7D, 0xFD7E, 0xFD7F, 0xFD80, 0xFD81, 0xFD82,
      0xFD83, 0xFD84, 0xFD85, 0xFD86, 0xFD87, 0xFD88, 0xFD89, 0xFD8A, 0xFD8B,
      0xFD8C, 0xFD8D, 0xFD8E, 0xFD8F, 0xFD92, 0xFD93, 0xFD94, 0xFD95, 0xFD96,
      0xFD97, 0xFD98, 0xFD99, 0xFD9A, 0xFD9B, 0xFD9C, 0xFD9D, 0xFD9E, 0xFD9F,
      0xFDA0, 0xFDA1, 0xFDA2, 0xFDA3, 0xFDA4, 0xFDA5, 0xFDA6, 0xFDA7, 0xFDA8,
      0xFDA9, 0xFDAA, 0xFDAB, 0xFDAC, 0xFDAD, 0xFDAE, 0xFDAF, 0xFDB0, 0xFDB1,
      0xFDB2, 0xFDB3, 0xFDB4, 0xFDB5, 0xFDB6, 0xFDB7, 0xFDB8, 0xFDB9, 0xFDBA,
      0xFDBB, 0xFDBC, 0xFDBD, 0xFDBE, 0xFDBF, 0xFDC0, 0xFDC1, 0xFDC2, 0xFDC3,
      0xFDC4, 0xFDC5, 0xFDC6, 0xFDC7, 0xFDF0, 0xFDF1, 0xFDF2, 0xFDF3, 0xFDF4,
      0xFDF5, 0xFDF6, 0xFDF7, 0xFDF8, 0xFDF9, 0xFDFA, 0xFDFB, 0xFDFC, 0xFE70,
      0xFE71, 0xFE72, 0xFE73, 0xFE74, 0xFE76, 0xFE77, 0xFE78, 0xFE79, 0xFE7A,
      0xFE7B, 0xFE7C, 0xFE7D, 0xFE7E, 0xFE7F, 0xFE80, 0xFE81, 0xFE82, 0xFE83,
      0xFE84, 0xFE85, 0xFE86, 0xFE87, 0xFE88, 0xFE89, 0xFE8A, 0xFE8B, 0xFE8C,
      0xFE8D, 0xFE8E, 0xFE8F, 0xFE90, 0xFE91, 0xFE92, 0xFE93, 0xFE94, 0xFE95,
      0xFE96, 0xFE97, 0xFE98, 0xFE99, 0xFE9A, 0xFE9B, 0xFE9C, 0xFE9D, 0xFE9E,
      0xFE9F, 0xFEA0, 0xFEA1, 0xFEA2, 0xFEA3, 0xFEA4, 0xFEA5, 0xFEA6, 0xFEA7,
      0xFEA8, 0xFEA9, 0xFEAA, 0xFEAB, 0xFEAC, 0xFEAD, 0xFEAE, 0xFEAF, 0xFEB0,
      0xFEB1, 0xFEB2, 0xFEB3, 0xFEB4, 0xFEB5, 0xFEB6, 0xFEB7, 0xFEB8, 0xFEB9,
      0xFEBA, 0xFEBB, 0xFEBC, 0xFEBD, 0xFEBE, 0xFEBF, 0xFEC0, 0xFEC1, 0xFEC2,
      0xFEC3, 0xFEC4, 0xFEC5, 0xFEC6, 0xFEC7, 0xFEC8, 0xFEC9, 0xFECA, 0xFECB,
      0xFECC, 0xFECD, 0xFECE, 0xFECF, 0xFED0, 0xFED1, 0xFED2, 0xFED3, 0xFED4,
      0xFED5, 0xFED6, 0xFED7, 0xFED8, 0xFED9, 0xFEDA, 0xFEDB, 0xFEDC, 0xFEDD,
      0xFEDE, 0xFEDF, 0xFEE0, 0xFEE1, 0xFEE2, 0xFEE3, 0xFEE4, 0xFEE5, 0xFEE6,
      0xFEE7, 0xFEE8, 0xFEE9, 0xFEEA, 0xFEEB, 0xFEEC, 0xFEED, 0xFEEE, 0xFEEF,
      0xFEF0, 0xFEF1, 0xFEF2, 0xFEF3, 0xFEF4, 0xFEF5, 0xFEF6, 0xFEF7, 0xFEF8,
      0xFEF9, 0xFEFA, 0xFEFB, 0xFEFC, 0x10800, 0x10801, 0x10802, 0x10803,
      0x10804, 0x10805, 0x10808, 0x1080A, 0x1080B, 0x1080C, 0x1080D, 0x1080E,
      0x1080F, 0x10810, 0x10811, 0x10812, 0x10813, 0x10814, 0x10815, 0x10816,
      0x10817, 0x10818, 0x10819, 0x1081A, 0x1081B, 0x1081C, 0x1081D, 0x1081E,
      0x1081F, 0x10820, 0x10821, 0x10822, 0x10823, 0x10824, 0x10825, 0x10826,
      0x10827, 0x10828, 0x10829, 0x1082A, 0x1082B, 0x1082C, 0x1082D, 0x1082E,
      0x1082F, 0x10830, 0x10831, 0x10832, 0x10833, 0x10834, 0x10835, 0x10837,
      0x10838, 0x1083C, 0x1083F, 0x10840, 0x10841, 0x10842, 0x10843, 0x10844,
      0x10845, 0x10846, 0x10847, 0x10848, 0x10849, 0x1084A, 0x1084B, 0x1084C,
      0x1084D, 0x1084E, 0x1084F, 0x10850, 0x10851, 0x10852, 0x10853, 0x10854,
      0x10855, 0x10857, 0x10858, 0x10859, 0x1085A, 0x1085B, 0x1085C, 0x1085D,
      0x1085E, 0x1085F, 0x10900, 0x10901, 0x10902, 0x10903, 0x10904, 0x10905,
      0x10906, 0x10907, 0x10908, 0x10909, 0x1090A, 0x1090B, 0x1090C, 0x1090D,
      0x1090E, 0x1090F, 0x10910, 0x10911, 0x10912, 0x10913, 0x10914, 0x10915,
      0x10916, 0x10917, 0x10918, 0x10919, 0x1091A, 0x1091B, 0x10920, 0x10921,
      0x10922, 0x10923, 0x10924, 0x10925, 0x10926, 0x10927, 0x10928, 0x10929,
      0x1092A, 0x1092B, 0x1092C, 0x1092D, 0x1092E, 0x1092F, 0x10930, 0x10931,
      0x10932, 0x10933, 0x10934, 0x10935, 0x10936, 0x10937, 0x10938, 0x10939,
      0x1093F, 0x10980, 0x10981, 0x10982, 0x10983, 0x10984, 0x10985, 0x10986,
      0x10987, 0x10988, 0x10989, 0x1098A, 0x1098B, 0x1098C, 0x1098D, 0x1098E,
      0x1098F, 0x10990, 0x10991, 0x10992, 0x10993, 0x10994, 0x10995, 0x10996,
      0x10997, 0x10998, 0x10999, 0x1099A, 0x1099B, 0x1099C, 0x1099D, 0x1099E,
      0x1099F, 0x109A0, 0x109A1, 0x109A2, 0x109A3, 0x109A4, 0x109A5, 0x109A6,
      0x109A7, 0x109A8, 0x109A9, 0x109AA, 0x109AB, 0x109AC, 0x109AD, 0x109AE,
      0x109AF, 0x109B0, 0x109B1, 0x109B2, 0x109B3, 0x109B4, 0x109B5, 0x109B6,
      0x109B7, 0x109BE, 0x109BF, 0x10A00, 0x10A10, 0x10A11, 0x10A12, 0x10A13,
      0x10A15, 0x10A16, 0x10A17, 0x10A19, 0x10A1A, 0x10A1B, 0x10A1C, 0x10A1D,
      0x10A1E, 0x10A1F, 0x10A20, 0x10A21, 0x10A22, 0x10A23, 0x10A24, 0x10A25,
      0x10A26, 0x10A27, 0x10A28, 0x10A29, 0x10A2A, 0x10A2B, 0x10A2C, 0x10A2D,
      0x10A2E, 0x10A2F, 0x10A30, 0x10A31, 0x10A32, 0x10A33, 0x10A40, 0x10A41,
      0x10A42, 0x10A43, 0x10A44, 0x10A45, 0x10A46, 0x10A47, 0x10A50, 0x10A51,
      0x10A52, 0x10A53, 0x10A54, 0x10A55, 0x10A56, 0x10A57, 0x10A58, 0x10A60,
      0x10A61, 0x10A62, 0x10A63, 0x10A64, 0x10A65, 0x10A66, 0x10A67, 0x10A68,
      0x10A69, 0x10A6A, 0x10A6B, 0x10A6C, 0x10A6D, 0x10A6E, 0x10A6F, 0x10A70,
      0x10A71, 0x10A72, 0x10A73, 0x10A74, 0x10A75, 0x10A76, 0x10A77, 0x10A78,
      0x10A79, 0x10A7A, 0x10A7B, 0x10A7C, 0x10A7D, 0x10A7E, 0x10A7F, 0x10B00,
      0x10B01, 0x10B02, 0x10B03, 0x10B04, 0x10B05, 0x10B06, 0x10B07, 0x10B08,
      0x10B09, 0x10B0A, 0x10B0B, 0x10B0C, 0x10B0D, 0x10B0E, 0x10B0F, 0x10B10,
      0x10B11, 0x10B12, 0x10B13, 0x10B14, 0x10B15, 0x10B16, 0x10B17, 0x10B18,
      0x10B19, 0x10B1A, 0x10B1B, 0x10B1C, 0x10B1D, 0x10B1E, 0x10B1F, 0x10B20,
      0x10B21, 0x10B22, 0x10B23, 0x10B24, 0x10B25, 0x10B26, 0x10B27, 0x10B28,
      0x10B29, 0x10B2A, 0x10B2B, 0x10B2C, 0x10B2D, 0x10B2E, 0x10B2F, 0x10B30,
      0x10B31, 0x10B32, 0x10B33, 0x10B34, 0x10B35, 0x10B40, 0x10B41, 0x10B42,
      0x10B43, 0x10B44, 0x10B45, 0x10B46, 0x10B47, 0x10B48, 0x10B49, 0x10B4A,
      0x10B4B, 0x10B4C, 0x10B4D, 0x10B4E, 0x10B4F, 0x10B50, 0x10B51, 0x10B52,
      0x10B53, 0x10B54, 0x10B55, 0x10B58, 0x10B59, 0x10B5A, 0x10B5B, 0x10B5C,
      0x10B5D, 0x10B5E, 0x10B5F, 0x10B60, 0x10B61, 0x10B62, 0x10B63, 0x10B64,
      0x10B65, 0x10B66, 0x10B67, 0x10B68, 0x10B69, 0x10B6A, 0x10B6B, 0x10B6C,
      0x10B6D, 0x10B6E, 0x10B6F, 0x10B70, 0x10B71, 0x10B72, 0x10B78, 0x10B79,
      0x10B7A, 0x10B7B, 0x10B7C, 0x10B7D, 0x10B7E, 0x10B7F, 0x10C00, 0x10C01,
      0x10C02, 0x10C03, 0x10C04, 0x10C05, 0x10C06, 0x10C07, 0x10C08, 0x10C09,
      0x10C0A, 0x10C0B, 0x10C0C, 0x10C0D, 0x10C0E, 0x10C0F, 0x10C10, 0x10C11,
      0x10C12, 0x10C13, 0x10C14, 0x10C15, 0x10C16, 0x10C17, 0x10C18, 0x10C19,
      0x10C1A, 0x10C1B, 0x10C1C, 0x10C1D, 0x10C1E, 0x10C1F, 0x10C20, 0x10C21,
      0x10C22, 0x10C23, 0x10C24, 0x10C25, 0x10C26, 0x10C27, 0x10C28, 0x10C29,
      0x10C2A, 0x10C2B, 0x10C2C, 0x10C2D, 0x10C2E, 0x10C2F, 0x10C30, 0x10C31,
      0x10C32, 0x10C33, 0x10C34, 0x10C35, 0x10C36, 0x10C37, 0x10C38, 0x10C39,
      0x10C3A, 0x10C3B, 0x10C3C, 0x10C3D, 0x10C3E, 0x10C3F, 0x10C40, 0x10C41,
      0x10C42, 0x10C43, 0x10C44, 0x10C45, 0x10C46, 0x10C47, 0x10C48, 0x1EE00,
      0x1EE01, 0x1EE02, 0x1EE03, 0x1EE05, 0x1EE06, 0x1EE07, 0x1EE08, 0x1EE09,
      0x1EE0A, 0x1EE0B, 0x1EE0C, 0x1EE0D, 0x1EE0E, 0x1EE0F, 0x1EE10, 0x1EE11,
      0x1EE12, 0x1EE13, 0x1EE14, 0x1EE15, 0x1EE16, 0x1EE17, 0x1EE18, 0x1EE19,
      0x1EE1A, 0x1EE1B, 0x1EE1C, 0x1EE1D, 0x1EE1E, 0x1EE1F, 0x1EE21, 0x1EE22,
      0x1EE24, 0x1EE27, 0x1EE29, 0x1EE2A, 0x1EE2B, 0x1EE2C, 0x1EE2D, 0x1EE2E,
      0x1EE2F, 0x1EE30, 0x1EE31, 0x1EE32, 0x1EE34, 0x1EE35, 0x1EE36, 0x1EE37,
      0x1EE39, 0x1EE3B, 0x1EE42, 0x1EE47, 0x1EE49, 0x1EE4B, 0x1EE4D, 0x1EE4E,
      0x1EE4F, 0x1EE51, 0x1EE52, 0x1EE54, 0x1EE57, 0x1EE59, 0x1EE5B, 0x1EE5D,
      0x1EE5F, 0x1EE61, 0x1EE62, 0x1EE64, 0x1EE67, 0x1EE68, 0x1EE69, 0x1EE6A,
      0x1EE6C, 0x1EE6D, 0x1EE6E, 0x1EE6F, 0x1EE70, 0x1EE71, 0x1EE72, 0x1EE74,
      0x1EE75, 0x1EE76, 0x1EE77, 0x1EE79, 0x1EE7A, 0x1EE7B, 0x1EE7C, 0x1EE7E,
      0x1EE80, 0x1EE81, 0x1EE82, 0x1EE83, 0x1EE84, 0x1EE85, 0x1EE86, 0x1EE87,
      0x1EE88, 0x1EE89, 0x1EE8B, 0x1EE8C, 0x1EE8D, 0x1EE8E, 0x1EE8F, 0x1EE90,
      0x1EE91, 0x1EE92, 0x1EE93, 0x1EE94, 0x1EE95, 0x1EE96, 0x1EE97, 0x1EE98,
      0x1EE99, 0x1EE9A, 0x1EE9B, 0x1EEA1, 0x1EEA2, 0x1EEA3, 0x1EEA5, 0x1EEA6,
      0x1EEA7, 0x1EEA8, 0x1EEA9, 0x1EEAB, 0x1EEAC, 0x1EEAD, 0x1EEAE, 0x1EEAF,
      0x1EEB0, 0x1EEB1, 0x1EEB2, 0x1EEB3, 0x1EEB4, 0x1EEB5, 0x1EEB6, 0x1EEB7,
      0x1EEB8, 0x1EEB9, 0x1EEBA, 0x1EEBB, 0x10FFFD];

  function determineBidi(cueDiv) {
    var nodeStack = [],
        text = "",
        charCode;

    if (!cueDiv || !cueDiv.childNodes) {
      return "ltr";
    }

    function pushNodes(nodeStack, node) {
      for (var i = node.childNodes.length - 1; i >= 0; i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }

    function nextTextNode(nodeStack) {
      if (!nodeStack || !nodeStack.length) {
        return null;
      }

      var node = nodeStack.pop(),
          text = node.textContent || node.innerText;
      if (text) {
        // TODO: This should match all unicode type B characters (paragraph
        // separator characters). See issue #115.
        var m = text.match(/^.*(\n|\r)/);
        if (m) {
          nodeStack.length = 0;
          return m[0];
        }
        return text;
      }
      if (node.tagName === "ruby") {
        return nextTextNode(nodeStack);
      }
      if (node.childNodes) {
        pushNodes(nodeStack, node);
        return nextTextNode(nodeStack);
      }
    }

    pushNodes(nodeStack, cueDiv);
    while ((text = nextTextNode(nodeStack))) {
      for (var i = 0; i < text.length; i++) {
        charCode = text.charCodeAt(i);
        for (var j = 0; j < strongRTLChars.length; j++) {
          if (strongRTLChars[j] === charCode) {
            return "rtl";
          }
        }
      }
    }
    return "ltr";
  }

  function computeLinePos(cue) {
    if (typeof cue.line === "number" &&
        (cue.snapToLines || (cue.line >= 0 && cue.line <= 100))) {
      return cue.line;
    }
    if (!cue.track || !cue.track.textTrackList ||
        !cue.track.textTrackList.mediaElement) {
      return -1;
    }
    var track = cue.track,
        trackList = track.textTrackList,
        count = 0;
    for (var i = 0; i < trackList.length && trackList[i] !== track; i++) {
      if (trackList[i].mode === "showing") {
        count++;
      }
    }
    return ++count * -1;
  }

  function StyleBox() {
  }

  // Apply styles to a div. If there is no div passed then it defaults to the
  // div on 'this'.
  StyleBox.prototype.applyStyles = function(styles, div) {
    div = div || this.div;
    for (var prop in styles) {
      if (styles.hasOwnProperty(prop)) {
        div.style[prop] = styles[prop];
      }
    }
  };

  StyleBox.prototype.formatStyle = function(val, unit) {
    return val === 0 ? 0 : val + unit;
  };

  // Constructs the computed display state of the cue (a div). Places the div
  // into the overlay which should be a block level element (usually a div).
  function CueStyleBox(window, cue, styleOptions) {
    var isIE8 = (/MSIE\s8\.0/).test(navigator.userAgent);
    var color = "rgba(255, 255, 255, 1)";
    var backgroundColor = "rgba(0, 0, 0, 0.8)";

    if (isIE8) {
      color = "rgb(255, 255, 255)";
      backgroundColor = "rgb(0, 0, 0)";
    }

    StyleBox.call(this);
    this.cue = cue;

    // Parse our cue's text into a DOM tree rooted at 'cueDiv'. This div will
    // have inline positioning and will function as the cue background box.
    this.cueDiv = parseContent(window, cue.text);
    var styles = {
      color: color,
      backgroundColor: backgroundColor,
      position: "relative",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "inline"
    };

    if (!isIE8) {
      styles.writingMode = cue.vertical === "" ? "horizontal-tb"
                                               : cue.vertical === "lr" ? "vertical-lr"
                                                                       : "vertical-rl";
      styles.unicodeBidi = "plaintext";
    }
    this.applyStyles(styles, this.cueDiv);

    // Create an absolutely positioned div that will be used to position the cue
    // div. Note, all WebVTT cue-setting alignments are equivalent to the CSS
    // mirrors of them except "middle" which is "center" in CSS.
    this.div = window.document.createElement("div");
    styles = {
      textAlign: cue.align === "middle" ? "center" : cue.align,
      font: styleOptions.font,
      whiteSpace: "pre-line",
      position: "absolute"
    };

    if (!isIE8) {
      styles.direction = determineBidi(this.cueDiv);
      styles.writingMode = cue.vertical === "" ? "horizontal-tb"
                                               : cue.vertical === "lr" ? "vertical-lr"
                                                                       : "vertical-rl".
      stylesunicodeBidi =  "plaintext";
    }

    this.applyStyles(styles);

    this.div.appendChild(this.cueDiv);

    // Calculate the distance from the reference edge of the viewport to the text
    // position of the cue box. The reference edge will be resolved later when
    // the box orientation styles are applied.
    var textPos = 0;
    switch (cue.positionAlign) {
    case "start":
      textPos = cue.position;
      break;
    case "middle":
      textPos = cue.position - (cue.size / 2);
      break;
    case "end":
      textPos = cue.position - cue.size;
      break;
    }

    // Horizontal box orientation; textPos is the distance from the left edge of the
    // area to the left edge of the box and cue.size is the distance extending to
    // the right from there.
    if (cue.vertical === "") {
      this.applyStyles({
        left:  this.formatStyle(textPos, "%"),
        width: this.formatStyle(cue.size, "%")
      });
    // Vertical box orientation; textPos is the distance from the top edge of the
    // area to the top edge of the box and cue.size is the height extending
    // downwards from there.
    } else {
      this.applyStyles({
        top: this.formatStyle(textPos, "%"),
        height: this.formatStyle(cue.size, "%")
      });
    }

    this.move = function(box) {
      this.applyStyles({
        top: this.formatStyle(box.top, "px"),
        bottom: this.formatStyle(box.bottom, "px"),
        left: this.formatStyle(box.left, "px"),
        right: this.formatStyle(box.right, "px"),
        height: this.formatStyle(box.height, "px"),
        width: this.formatStyle(box.width, "px")
      });
    };
  }
  CueStyleBox.prototype = _objCreate(StyleBox.prototype);
  CueStyleBox.prototype.constructor = CueStyleBox;

  // Represents the co-ordinates of an Element in a way that we can easily
  // compute things with such as if it overlaps or intersects with another Element.
  // Can initialize it with either a StyleBox or another BoxPosition.
  function BoxPosition(obj) {
    var isIE8 = (/MSIE\s8\.0/).test(navigator.userAgent);

    // Either a BoxPosition was passed in and we need to copy it, or a StyleBox
    // was passed in and we need to copy the results of 'getBoundingClientRect'
    // as the object returned is readonly. All co-ordinate values are in reference
    // to the viewport origin (top left).
    var lh, height, width, top;
    if (obj.div) {
      height = obj.div.offsetHeight;
      width = obj.div.offsetWidth;
      top = obj.div.offsetTop;

      var rects = (rects = obj.div.childNodes) && (rects = rects[0]) &&
                  rects.getClientRects && rects.getClientRects();
      obj = obj.div.getBoundingClientRect();
      // In certain cases the outter div will be slightly larger then the sum of
      // the inner div's lines. This could be due to bold text, etc, on some platforms.
      // In this case we should get the average line height and use that. This will
      // result in the desired behaviour.
      lh = rects ? Math.max((rects[0] && rects[0].height) || 0, obj.height / rects.length)
                 : 0;

    }
    this.left = obj.left;
    this.right = obj.right;
    this.top = obj.top || top;
    this.height = obj.height || height;
    this.bottom = obj.bottom || (top + (obj.height || height));
    this.width = obj.width || width;
    this.lineHeight = lh !== undefined ? lh : obj.lineHeight;

    if (isIE8 && !this.lineHeight) {
      this.lineHeight = 13;
    }
  }

  // Move the box along a particular axis. Optionally pass in an amount to move
  // the box. If no amount is passed then the default is the line height of the
  // box.
  BoxPosition.prototype.move = function(axis, toMove) {
    toMove = toMove !== undefined ? toMove : this.lineHeight;
    switch (axis) {
    case "+x":
      this.left += toMove;
      this.right += toMove;
      break;
    case "-x":
      this.left -= toMove;
      this.right -= toMove;
      break;
    case "+y":
      this.top += toMove;
      this.bottom += toMove;
      break;
    case "-y":
      this.top -= toMove;
      this.bottom -= toMove;
      break;
    }
  };

  // Check if this box overlaps another box, b2.
  BoxPosition.prototype.overlaps = function(b2) {
    return this.left < b2.right &&
           this.right > b2.left &&
           this.top < b2.bottom &&
           this.bottom > b2.top;
  };

  // Check if this box overlaps any other boxes in boxes.
  BoxPosition.prototype.overlapsAny = function(boxes) {
    for (var i = 0; i < boxes.length; i++) {
      if (this.overlaps(boxes[i])) {
        return true;
      }
    }
    return false;
  };

  // Check if this box is within another box.
  BoxPosition.prototype.within = function(container) {
    return this.top >= container.top &&
           this.bottom <= container.bottom &&
           this.left >= container.left &&
           this.right <= container.right;
  };

  // Check if this box is entirely within the container or it is overlapping
  // on the edge opposite of the axis direction passed. For example, if "+x" is
  // passed and the box is overlapping on the left edge of the container, then
  // return true.
  BoxPosition.prototype.overlapsOppositeAxis = function(container, axis) {
    switch (axis) {
    case "+x":
      return this.left < container.left;
    case "-x":
      return this.right > container.right;
    case "+y":
      return this.top < container.top;
    case "-y":
      return this.bottom > container.bottom;
    }
  };

  // Find the percentage of the area that this box is overlapping with another
  // box.
  BoxPosition.prototype.intersectPercentage = function(b2) {
    var x = Math.max(0, Math.min(this.right, b2.right) - Math.max(this.left, b2.left)),
        y = Math.max(0, Math.min(this.bottom, b2.bottom) - Math.max(this.top, b2.top)),
        intersectArea = x * y;
    return intersectArea / (this.height * this.width);
  };

  // Convert the positions from this box to CSS compatible positions using
  // the reference container's positions. This has to be done because this
  // box's positions are in reference to the viewport origin, whereas, CSS
  // values are in referecne to their respective edges.
  BoxPosition.prototype.toCSSCompatValues = function(reference) {
    return {
      top: this.top - reference.top,
      bottom: reference.bottom - this.bottom,
      left: this.left - reference.left,
      right: reference.right - this.right,
      height: this.height,
      width: this.width
    };
  };

  // Get an object that represents the box's position without anything extra.
  // Can pass a StyleBox, HTMLElement, or another BoxPositon.
  BoxPosition.getSimpleBoxPosition = function(obj) {
    var height = obj.div ? obj.div.offsetHeight : obj.tagName ? obj.offsetHeight : 0;
    var width = obj.div ? obj.div.offsetWidth : obj.tagName ? obj.offsetWidth : 0;
    var top = obj.div ? obj.div.offsetTop : obj.tagName ? obj.offsetTop : 0;

    obj = obj.div ? obj.div.getBoundingClientRect() :
                  obj.tagName ? obj.getBoundingClientRect() : obj;
    var ret = {
      left: obj.left,
      right: obj.right,
      top: obj.top || top,
      height: obj.height || height,
      bottom: obj.bottom || (top + (obj.height || height)),
      width: obj.width || width
    };
    return ret;
  };

  // Move a StyleBox to its specified, or next best, position. The containerBox
  // is the box that contains the StyleBox, such as a div. boxPositions are
  // a list of other boxes that the styleBox can't overlap with.
  function moveBoxToLinePosition(window, styleBox, containerBox, boxPositions) {

    // Find the best position for a cue box, b, on the video. The axis parameter
    // is a list of axis, the order of which, it will move the box along. For example:
    // Passing ["+x", "-x"] will move the box first along the x axis in the positive
    // direction. If it doesn't find a good position for it there it will then move
    // it along the x axis in the negative direction.
    function findBestPosition(b, axis) {
      var bestPosition,
          specifiedPosition = new BoxPosition(b),
          percentage = 1; // Highest possible so the first thing we get is better.

      for (var i = 0; i < axis.length; i++) {
        while (b.overlapsOppositeAxis(containerBox, axis[i]) ||
               (b.within(containerBox) && b.overlapsAny(boxPositions))) {
          b.move(axis[i]);
        }
        // We found a spot where we aren't overlapping anything. This is our
        // best position.
        if (b.within(containerBox)) {
          return b;
        }
        var p = b.intersectPercentage(containerBox);
        // If we're outside the container box less then we were on our last try
        // then remember this position as the best position.
        if (percentage > p) {
          bestPosition = new BoxPosition(b);
          percentage = p;
        }
        // Reset the box position to the specified position.
        b = new BoxPosition(specifiedPosition);
      }
      return bestPosition || specifiedPosition;
    }

    var boxPosition = new BoxPosition(styleBox),
        cue = styleBox.cue,
        linePos = computeLinePos(cue),
        axis = [];

    // If we have a line number to align the cue to.
    if (cue.snapToLines) {
      var size;
      switch (cue.vertical) {
      case "":
        axis = [ "+y", "-y" ];
        size = "height";
        break;
      case "rl":
        axis = [ "+x", "-x" ];
        size = "width";
        break;
      case "lr":
        axis = [ "-x", "+x" ];
        size = "width";
        break;
      }

      var step = boxPosition.lineHeight,
          position = step * Math.round(linePos),
          maxPosition = containerBox[size] + step,
          initialAxis = axis[0];

      // If the specified intial position is greater then the max position then
      // clamp the box to the amount of steps it would take for the box to
      // reach the max position.
      if (Math.abs(position) > maxPosition) {
        position = position < 0 ? -1 : 1;
        position *= Math.ceil(maxPosition / step) * step;
      }

      // If computed line position returns negative then line numbers are
      // relative to the bottom of the video instead of the top. Therefore, we
      // need to increase our initial position by the length or width of the
      // video, depending on the writing direction, and reverse our axis directions.
      if (linePos < 0) {
        position += cue.vertical === "" ? containerBox.height : containerBox.width;
        axis = axis.reverse();
      }

      // Move the box to the specified position. This may not be its best
      // position.
      boxPosition.move(initialAxis, position);

    } else {
      // If we have a percentage line value for the cue.
      var calculatedPercentage = (boxPosition.lineHeight / containerBox.height) * 100;

      switch (cue.lineAlign) {
      case "middle":
        linePos -= (calculatedPercentage / 2);
        break;
      case "end":
        linePos -= calculatedPercentage;
        break;
      }

      // Apply initial line position to the cue box.
      switch (cue.vertical) {
      case "":
        styleBox.applyStyles({
          top: styleBox.formatStyle(linePos, "%")
        });
        break;
      case "rl":
        styleBox.applyStyles({
          left: styleBox.formatStyle(linePos, "%")
        });
        break;
      case "lr":
        styleBox.applyStyles({
          right: styleBox.formatStyle(linePos, "%")
        });
        break;
      }

      axis = [ "+y", "-x", "+x", "-y" ];

      // Get the box position again after we've applied the specified positioning
      // to it.
      boxPosition = new BoxPosition(styleBox);
    }

    var bestPosition = findBestPosition(boxPosition, axis);
    styleBox.move(bestPosition.toCSSCompatValues(containerBox));
  }

  function WebVTT() {
    // Nothing
  }

  // Helper to allow strings to be decoded instead of the default binary utf8 data.
  WebVTT.StringDecoder = function() {
    return {
      decode: function(data) {
        if (!data) {
          return "";
        }
        if (typeof data !== "string") {
          throw new Error("Error - expected string data.");
        }
        return decodeURIComponent(encodeURIComponent(data));
      }
    };
  };

  WebVTT.convertCueToDOMTree = function(window, cuetext) {
    if (!window || !cuetext) {
      return null;
    }
    return parseContent(window, cuetext);
  };

  var FONT_SIZE_PERCENT = 0.05;
  var FONT_STYLE = "sans-serif";
  var CUE_BACKGROUND_PADDING = "1.5%";

  // Runs the processing model over the cues and regions passed to it.
  // @param overlay A block level element (usually a div) that the computed cues
  //                and regions will be placed into.
  WebVTT.processCues = function(window, cues, overlay) {
    if (!window || !cues || !overlay) {
      return null;
    }

    // Remove all previous children.
    while (overlay.firstChild) {
      overlay.removeChild(overlay.firstChild);
    }

    var paddedOverlay = window.document.createElement("div");
    paddedOverlay.style.position = "absolute";
    paddedOverlay.style.left = "0";
    paddedOverlay.style.right = "0";
    paddedOverlay.style.top = "0";
    paddedOverlay.style.bottom = "0";
    paddedOverlay.style.margin = CUE_BACKGROUND_PADDING;
    overlay.appendChild(paddedOverlay);

    // Determine if we need to compute the display states of the cues. This could
    // be the case if a cue's state has been changed since the last computation or
    // if it has not been computed yet.
    function shouldCompute(cues) {
      for (var i = 0; i < cues.length; i++) {
        if (cues[i].hasBeenReset || !cues[i].displayState) {
          return true;
        }
      }
      return false;
    }

    // We don't need to recompute the cues' display states. Just reuse them.
    if (!shouldCompute(cues)) {
      for (var i = 0; i < cues.length; i++) {
        paddedOverlay.appendChild(cues[i].displayState);
      }
      return;
    }

    var boxPositions = [],
        containerBox = BoxPosition.getSimpleBoxPosition(paddedOverlay),
        fontSize = Math.round(containerBox.height * FONT_SIZE_PERCENT * 100) / 100;
    var styleOptions = {
      font: fontSize + "px " + FONT_STYLE
    };

    (function() {
      var styleBox, cue;

      for (var i = 0; i < cues.length; i++) {
        cue = cues[i];

        // Compute the intial position and styles of the cue div.
        styleBox = new CueStyleBox(window, cue, styleOptions);
        paddedOverlay.appendChild(styleBox.div);

        // Move the cue div to it's correct line position.
        moveBoxToLinePosition(window, styleBox, containerBox, boxPositions);

        // Remember the computed div so that we don't have to recompute it later
        // if we don't have too.
        cue.displayState = styleBox.div;

        boxPositions.push(BoxPosition.getSimpleBoxPosition(styleBox));
      }
    })();
  };

  WebVTT.Parser = function(window, decoder) {
    this.window = window;
    this.state = "INITIAL";
    this.buffer = "";
    this.decoder = decoder || new TextDecoder("utf8");
    this.regionList = [];
  };

  WebVTT.Parser.prototype = {
    // If the error is a ParsingError then report it to the consumer if
    // possible. If it's not a ParsingError then throw it like normal.
    reportOrThrowError: function(e) {
      if (e instanceof ParsingError) {
        this.onparsingerror && this.onparsingerror(e);
      } else {
        throw e;
      }
    },
    parse: function (data) {
      var self = this;

      // If there is no data then we won't decode it, but will just try to parse
      // whatever is in buffer already. This may occur in circumstances, for
      // example when flush() is called.
      if (data) {
        // Try to decode the data that we received.
        self.buffer += self.decoder.decode(data, {stream: true});
      }

      function collectNextLine() {
        var buffer = self.buffer;
        var pos = 0;
        while (pos < buffer.length && buffer[pos] !== '\r' && buffer[pos] !== '\n') {
          ++pos;
        }
        var line = buffer.substr(0, pos);
        // Advance the buffer early in case we fail below.
        if (buffer[pos] === '\r') {
          ++pos;
        }
        if (buffer[pos] === '\n') {
          ++pos;
        }
        self.buffer = buffer.substr(pos);
        return line;
      }

      // 3.4 WebVTT region and WebVTT region settings syntax
      function parseRegion(input) {
        var settings = new Settings();

        parseOptions(input, function (k, v) {
          switch (k) {
          case "id":
            settings.set(k, v);
            break;
          case "width":
            settings.percent(k, v);
            break;
          case "lines":
            settings.integer(k, v);
            break;
          case "regionanchor":
          case "viewportanchor":
            var xy = v.split(',');
            if (xy.length !== 2) {
              break;
            }
            // We have to make sure both x and y parse, so use a temporary
            // settings object here.
            var anchor = new Settings();
            anchor.percent("x", xy[0]);
            anchor.percent("y", xy[1]);
            if (!anchor.has("x") || !anchor.has("y")) {
              break;
            }
            settings.set(k + "X", anchor.get("x"));
            settings.set(k + "Y", anchor.get("y"));
            break;
          case "scroll":
            settings.alt(k, v, ["up"]);
            break;
          }
        }, /=/, /\s/);

        // Create the region, using default values for any values that were not
        // specified.
        if (settings.has("id")) {
          var region = new self.window.VTTRegion();
          region.width = settings.get("width", 100);
          region.lines = settings.get("lines", 3);
          region.regionAnchorX = settings.get("regionanchorX", 0);
          region.regionAnchorY = settings.get("regionanchorY", 100);
          region.viewportAnchorX = settings.get("viewportanchorX", 0);
          region.viewportAnchorY = settings.get("viewportanchorY", 100);
          region.scroll = settings.get("scroll", "");
          // Register the region.
          self.onregion && self.onregion(region);
          // Remember the VTTRegion for later in case we parse any VTTCues that
          // reference it.
          self.regionList.push({
            id: settings.get("id"),
            region: region
          });
        }
      }

      // 3.2 WebVTT metadata header syntax
      function parseHeader(input) {
        parseOptions(input, function (k, v) {
          switch (k) {
          case "Region":
            // 3.3 WebVTT region metadata header syntax
            parseRegion(v);
            break;
          }
        }, /:/);
      }

      // 5.1 WebVTT file parsing.
      try {
        var line;
        if (self.state === "INITIAL") {
          // We can't start parsing until we have the first line.
          if (!/\r\n|\n/.test(self.buffer)) {
            return this;
          }

          line = collectNextLine();

          var m = line.match(/^WEBVTT([ \t].*)?$/);
          if (!m || !m[0]) {
            throw new ParsingError(ParsingError.Errors.BadSignature);
          }

          self.state = "HEADER";
        }

        var alreadyCollectedLine = false;
        while (self.buffer) {
          // We can't parse a line until we have the full line.
          if (!/\r\n|\n/.test(self.buffer)) {
            return this;
          }

          if (!alreadyCollectedLine) {
            line = collectNextLine();
          } else {
            alreadyCollectedLine = false;
          }

          switch (self.state) {
          case "HEADER":
            // 13-18 - Allow a header (metadata) under the WEBVTT line.
            if (/:/.test(line)) {
              parseHeader(line);
            } else if (!line) {
              // An empty line terminates the header and starts the body (cues).
              self.state = "ID";
            }
            continue;
          case "NOTE":
            // Ignore NOTE blocks.
            if (!line) {
              self.state = "ID";
            }
            continue;
          case "ID":
            // Check for the start of NOTE blocks.
            if (/^NOTE($|[ \t])/.test(line)) {
              self.state = "NOTE";
              break;
            }
            // 19-29 - Allow any number of line terminators, then initialize new cue values.
            if (!line) {
              continue;
            }
            self.cue = new self.window.VTTCue(0, 0, "");
            self.state = "CUE";
            // 30-39 - Check if self line contains an optional identifier or timing data.
            if (line.indexOf("-->") === -1) {
              self.cue.id = line;
              continue;
            }
            // Process line as start of a cue.
            /*falls through*/
          case "CUE":
            // 40 - Collect cue timings and settings.
            try {
              parseCue(line, self.cue, self.regionList);
            } catch (e) {
              self.reportOrThrowError(e);
              // In case of an error ignore rest of the cue.
              self.cue = null;
              self.state = "BADCUE";
              continue;
            }
            self.state = "CUETEXT";
            continue;
          case "CUETEXT":
            var hasSubstring = line.indexOf("-->") !== -1;
            // 34 - If we have an empty line then report the cue.
            // 35 - If we have the special substring '-->' then report the cue,
            // but do not collect the line as we need to process the current
            // one as a new cue.
            if (!line || hasSubstring && (alreadyCollectedLine = true)) {
              // We are done parsing self cue.
              self.oncue && self.oncue(self.cue);
              self.cue = null;
              self.state = "ID";
              continue;
            }
            if (self.cue.text) {
              self.cue.text += "\n";
            }
            self.cue.text += line;
            continue;
          case "BADCUE": // BADCUE
            // 54-62 - Collect and discard the remaining cue.
            if (!line) {
              self.state = "ID";
            }
            continue;
          }
        }
      } catch (e) {
        self.reportOrThrowError(e);

        // If we are currently parsing a cue, report what we have.
        if (self.state === "CUETEXT" && self.cue && self.oncue) {
          self.oncue(self.cue);
        }
        self.cue = null;
        // Enter BADWEBVTT state if header was not parsed correctly otherwise
        // another exception occurred so enter BADCUE state.
        self.state = self.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
      }
      return this;
    },
    flush: function () {
      var self = this;
      try {
        // Finish decoding the stream.
        self.buffer += self.decoder.decode();
        // Synthesize the end of the current cue or region.
        if (self.cue || self.state === "HEADER") {
          self.buffer += "\n\n";
          self.parse();
        }
        // If we've flushed, parsed, and we're still on the INITIAL state then
        // that means we don't have enough of the stream to parse the first
        // line.
        if (self.state === "INITIAL") {
          throw new ParsingError(ParsingError.Errors.BadSignature);
        }
      } catch(e) {
        self.reportOrThrowError(e);
      }
      self.onflush && self.onflush();
      return this;
    }
  };

  global.WebVTT = WebVTT;

}(this));

},{}],5:[function(require,module,exports){
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If we're in Node.js then require VTTCue so we can extend it, otherwise assume
// VTTCue is on the global.
if (typeof module !== "undefined" && module.exports) {
  this.VTTCue = this.VTTCue || require("./vttcue").VTTCue;
}

// Extend VTTCue with methods to convert to JSON, from JSON, and construct a
// VTTCue from an options object. The primary purpose of this is for use in the
// vtt.js test suite (for testing only properties that we care about). It's also
// useful if you need to work with VTTCues in JSON format.
(function(root) {

  root.VTTCue.prototype.toJSON = function() {
    var cue = {},
        self = this;
    // Filter out getCueAsHTML as it's a function and hasBeenReset and displayState as
    // they're only used when running the processing model algorithm.
    Object.keys(this).forEach(function(key) {
      if (key !== "getCueAsHTML" && key !== "hasBeenReset" && key !== "displayState") {
        cue[key] = self[key];
      }
    });
    return cue;
  };

  root.VTTCue.create = function(options) {
    if (!options.hasOwnProperty("startTime") || !options.hasOwnProperty("endTime") ||
        !options.hasOwnProperty("text")) {
      throw new Error("You must at least have start time, end time, and text.");
    }
    var cue = new root.VTTCue(options.startTime, options.endTime, options.text);
    for (var key in options) {
      if (cue.hasOwnProperty(key)) {
        cue[key] = options[key];
      }
    }
    return cue;
  };

  root.VTTCue.fromJSON = function(json) {
    return this.create(JSON.parse(json));
  };

}(this));

},{"./vttcue":6}],6:[function(require,module,exports){
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root) {

  var autoKeyword = "auto";
  var directionSetting = {
    "": true,
    "lr": true,
    "rl": true
  };
  var alignSetting = {
    "start": true,
    "middle": true,
    "end": true,
    "left": true,
    "right": true
  };

  function findDirectionSetting(value) {
    if (typeof value !== "string") {
      return false;
    }
    var dir = directionSetting[value.toLowerCase()];
    return dir ? value.toLowerCase() : false;
  }

  function findAlignSetting(value) {
    if (typeof value !== "string") {
      return false;
    }
    var align = alignSetting[value.toLowerCase()];
    return align ? value.toLowerCase() : false;
  }

  function extend(obj) {
    var i = 1;
    for (; i < arguments.length; i++) {
      var cobj = arguments[i];
      for (var p in cobj) {
        obj[p] = cobj[p];
      }
    }

    return obj;
  }

  function VTTCue(startTime, endTime, text) {
    var cue = this;
    var isIE8 = (/MSIE\s8\.0/).test(navigator.userAgent);
    var baseObj = {};

    if (isIE8) {
      cue = document.createElement('custom');
    } else {
      baseObj.enumerable = true;
    }

    /**
     * Shim implementation specific properties. These properties are not in
     * the spec.
     */

    // Lets us know when the VTTCue's data has changed in such a way that we need
    // to recompute its display state. This lets us compute its display state
    // lazily.
    cue.hasBeenReset = false;

    /**
     * VTTCue and TextTrackCue properties
     * http://dev.w3.org/html5/webvtt/#vttcue-interface
     */

    var _id = "";
    var _pauseOnExit = false;
    var _startTime = startTime;
    var _endTime = endTime;
    var _text = text;
    var _region = null;
    var _vertical = "";
    var _snapToLines = true;
    var _line = "auto";
    var _lineAlign = "start";
    var _position = 50;
    var _positionAlign = "middle";
    var _size = 50;
    var _align = "middle";

    Object.defineProperty(cue,
      "id", extend({}, baseObj, {
        get: function() {
          return _id;
        },
        set: function(value) {
          _id = "" + value;
        }
      }));

    Object.defineProperty(cue,
      "pauseOnExit", extend({}, baseObj, {
        get: function() {
          return _pauseOnExit;
        },
        set: function(value) {
          _pauseOnExit = !!value;
        }
      }));

    Object.defineProperty(cue,
      "startTime", extend({}, baseObj, {
        get: function() {
          return _startTime;
        },
        set: function(value) {
          if (typeof value !== "number") {
            throw new TypeError("Start time must be set to a number.");
          }
          _startTime = value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "endTime", extend({}, baseObj, {
        get: function() {
          return _endTime;
        },
        set: function(value) {
          if (typeof value !== "number") {
            throw new TypeError("End time must be set to a number.");
          }
          _endTime = value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "text", extend({}, baseObj, {
        get: function() {
          return _text;
        },
        set: function(value) {
          _text = "" + value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "region", extend({}, baseObj, {
        get: function() {
          return _region;
        },
        set: function(value) {
          _region = value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "vertical", extend({}, baseObj, {
        get: function() {
          return _vertical;
        },
        set: function(value) {
          var setting = findDirectionSetting(value);
          // Have to check for false because the setting an be an empty string.
          if (setting === false) {
            throw new SyntaxError("An invalid or illegal string was specified.");
          }
          _vertical = setting;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "snapToLines", extend({}, baseObj, {
        get: function() {
          return _snapToLines;
        },
        set: function(value) {
          _snapToLines = !!value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "line", extend({}, baseObj, {
        get: function() {
          return _line;
        },
        set: function(value) {
          if (typeof value !== "number" && value !== autoKeyword) {
            throw new SyntaxError("An invalid number or illegal string was specified.");
          }
          _line = value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "lineAlign", extend({}, baseObj, {
        get: function() {
          return _lineAlign;
        },
        set: function(value) {
          var setting = findAlignSetting(value);
          if (!setting) {
            throw new SyntaxError("An invalid or illegal string was specified.");
          }
          _lineAlign = setting;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "position", extend({}, baseObj, {
        get: function() {
          return _position;
        },
        set: function(value) {
          if (value < 0 || value > 100) {
            throw new Error("Position must be between 0 and 100.");
          }
          _position = value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "positionAlign", extend({}, baseObj, {
        get: function() {
          return _positionAlign;
        },
        set: function(value) {
          var setting = findAlignSetting(value);
          if (!setting) {
            throw new SyntaxError("An invalid or illegal string was specified.");
          }
          _positionAlign = setting;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "size", extend({}, baseObj, {
        get: function() {
          return _size;
        },
        set: function(value) {
          if (value < 0 || value > 100) {
            throw new Error("Size must be between 0 and 100.");
          }
          _size = value;
          this.hasBeenReset = true;
        }
      }));

    Object.defineProperty(cue,
      "align", extend({}, baseObj, {
        get: function() {
          return _align;
        },
        set: function(value) {
          var setting = findAlignSetting(value);
          if (!setting) {
            throw new SyntaxError("An invalid or illegal string was specified.");
          }
          _align = setting;
          this.hasBeenReset = true;
        }
      }));

    /**
     * Other <track> spec defined properties
     */

    // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-video-element.html#text-track-cue-display-state
    cue.displayState = undefined;

    if (isIE8) {
      return cue;
    }
  }

  /**
   * VTTCue methods
   */

  VTTCue.prototype.getCueAsHTML = function() {
    // Assume WebVTT.convertCueToDOMTree is on the global.
    return WebVTT.convertCueToDOMTree(window, this.text);
  };

  root.VTTCue = VTTCue || root.VTTCue;
}(this));

},{}],7:[function(require,module,exports){
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If we're in Node.js then require VTTRegion so we can extend it, otherwise assume
// VTTRegion is on the global.
if (typeof module !== "undefined" && module.exports) {
  this.VTTRegion = require("./vttregion").VTTRegion;
}

// Extend VTTRegion with methods to convert to JSON, from JSON, and construct a
// VTTRegion from an options object. The primary purpose of this is for use in the
// vtt.js test suite. It's also useful if you need to work with VTTRegions in
// JSON format.
(function(root) {

  root.VTTRegion.create = function(options) {
    var region = new root.VTTRegion();
    for (var key in options) {
      if (region.hasOwnProperty(key)) {
        region[key] = options[key];
      }
    }
    return region;
  };

  root.VTTRegion.fromJSON = function(json) {
    return this.create(JSON.parse(json));
  };

}(this));

},{"./vttregion":8}],8:[function(require,module,exports){
/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root) {

  var scrollSetting = {
    "": true,
    "up": true
  };

  function findScrollSetting(value) {
    if (typeof value !== "string") {
      return false;
    }
    var scroll = scrollSetting[value.toLowerCase()];
    return scroll ? value.toLowerCase() : false;
  }

  function isValidPercentValue(value) {
    return typeof value === "number" && (value >= 0 && value <= 100);
  }

  // VTTRegion shim http://dev.w3.org/html5/webvtt/#vttregion-interface
  function VTTRegion() {
    var _width = 100;
    var _lines = 3;
    var _regionAnchorX = 0;
    var _regionAnchorY = 100;
    var _viewportAnchorX = 0;
    var _viewportAnchorY = 100;
    var _scroll = "";

    Object.defineProperties(this, {
      "width": {
        enumerable: true,
        get: function() {
          return _width;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("Width must be between 0 and 100.");
          }
          _width = value;
        }
      },
      "lines": {
        enumerable: true,
        get: function() {
          return _lines;
        },
        set: function(value) {
          if (typeof value !== "number") {
            throw new TypeError("Lines must be set to a number.");
          }
          _lines = value;
        }
      },
      "regionAnchorY": {
        enumerable: true,
        get: function() {
          return _regionAnchorY;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("RegionAnchorX must be between 0 and 100.");
          }
          _regionAnchorY = value;
        }
      },
      "regionAnchorX": {
        enumerable: true,
        get: function() {
          return _regionAnchorX;
        },
        set: function(value) {
          if(!isValidPercentValue(value)) {
            throw new Error("RegionAnchorY must be between 0 and 100.");
          }
          _regionAnchorX = value;
        }
      },
      "viewportAnchorY": {
        enumerable: true,
        get: function() {
          return _viewportAnchorY;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("ViewportAnchorY must be between 0 and 100.");
          }
          _viewportAnchorY = value;
        }
      },
      "viewportAnchorX": {
        enumerable: true,
        get: function() {
          return _viewportAnchorX;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("ViewportAnchorX must be between 0 and 100.");
          }
          _viewportAnchorX = value;
        }
      },
      "scroll": {
        enumerable: true,
        get: function() {
          return _scroll;
        },
        set: function(value) {
          var setting = findScrollSetting(value);
          // Have to check for false as an empty string is a legal value.
          if (setting === false) {
            throw new SyntaxError("An invalid or illegal string was specified.");
          }
          _scroll = setting;
        }
      }
    });
  }

  root.VTTRegion = root.VTTRegion || VTTRegion;
}(this));

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */

/**
 * Shows current state of video properties.
 * @type {Class}
 */
var Debugger = new Class({
    Implements: [Options],

    options: {
        disabled: false,
        monitorProperties: ['autoplay', 'controls', 'currentSrc', 'currentTime', 'duration', 'ended', 'error', 'loop', 'muted', 'networkState', 'paused', 'playbackRate', 'preload', 'readyState', 'seeking', 'volume']
    },

    initialize: function initialize(video, options) {
        this.video = document.id(video);
        this.setOptions(options);
        this.bound = this.getBoundEvents();
        this.build();
        this[this.options.disabled ? 'disable' : 'enable']();
    },

    build: function build() {
        var _this = this;

        this.element = new Element('div.debug');
        this.elements = {
            table: new Element('table'),
            tbody: new Element('tbody'),
            p: new Element('p[text=Debugger ready...]')
        };

        this.options.monitorProperties.forEach(function (property) {
            var row = new Element('tr[data-property=' + property + ']');
            var label = new Element('td[text=' + property + ']');
            var value = new Element('td[text=' + _this.video[property] + ']');

            row.adopt(label, value);
            _this.elements.tbody.grab(row);
        });

        this.elements.table.grab(this.elements.tbody);
        this.element.adopt(this.elements.table, this.elements.p);

        return this;
    },

    attach: function attach() {
        this.video.addEvents(this.bound);

        return this;
    },

    detach: function detach() {
        this.video.removeEvents(this.bound);

        return this;
    },

    enable: function enable() {
        this.disabled = false;
        this.element.set('aria-disabled', false);

        return this.attach();
    },

    disable: function disable() {
        this.disabled = true;
        this.element.set('aria-disabled', true);

        return this.detach();
    },

    flashProperty: function flashProperty(property, value) {
        this.elements.tbody.getElement('[data-property=' + property + '] > td + td').set('text', value || this.video[property]).getParent().highlight();

        return this;
    },

    flashMessage: function flashMessage(message) {
        this.elements.p.set('html', message).highlight();

        return this;
    },

    toElement: function toElement() {
        return this.element;
    },

    getBoundEvents: function getBoundEvents() {
        var _this2 = this;

        return {
            loadstart: function loadstart() {
                _this2.flashProperty('networkState').flashMessage('looking for data...');
            },

            progress: function progress() {
                _this2.flashProperty('networkState').flashMessage('fetching data...');
            },

            suspend: function suspend() {
                _this2.flashProperty('networkState').flashMessage('data fetching suspended...');
            },

            abort: function abort() {
                _this2.flashProperty('networkState').flashMessage('data fetching aborted...');
            },

            error: function error() {
                _this2.flashProperty('networkState').flashProperty('error', _this2.video.error ? _this2.video.error.code : null).flashMessage('an error occurred while fetching data...');
            },

            emptied: function emptied() {
                _this2.flashProperty('networkState').flashMessage('media resource is empty...');
            },

            stalled: function stalled() {
                _this2.flashProperty('networkState').flashMessage('stalled while fetching data...');
            },

            loadedmetadata: function loadedmetadata() {
                _this2.flashProperty('readyState').flashMessage('duration and dimensions have been determined...');
            },

            loadeddata: function loadeddata() {
                _this2.flashProperty('readyState').flashMessage('first frame is available...');
            },

            waiting: function waiting() {
                _this2.flashProperty('readyState').flashMessage('waiting for more data...');
            },

            playing: function playing() {
                _this2.flashProperty('readyState').flashMessage('playback has started...');
            },

            canplay: function canplay() {
                _this2.flashProperty('readyState').flashMessage('media is ready to be played, but will likely be interrupted for buffering...');
            },

            canplaythrough: function canplaythrough() {
                _this2.flashProperty('readyState').flashMessage('media is ready to be played and will most likely play through without stopping...');
            },

            play: function play() {
                _this2.flashProperty('paused');
            },

            pause: function pause() {
                _this2.flashProperty('paused');
            },

            ended: function ended() {
                _this2.flashProperty('paused').flashProperty('ended');
            },

            timeupdate: function timeupdate() {
                _this2.flashProperty('currentTime', _this2.video.currentTime.round(3));
            },

            seeking: function seeking() {
                _this2.flashProperty('seeking');
            },

            seeked: function seeked() {
                _this2.flashProperty('seeking');
            },

            durationchange: function durationchange() {
                _this2.flashProperty('duration', _this2.video.duration.round(3));
            },

            ratechange: function ratechange() {
                _this2.flashProperty('playbackRate');
            },

            volumechange: function volumechange() {
                _this2.flashProperty('muted').flashProperty('volume', _this2.video.volume.round(2));
            }
        };
    }
});

exports.default = Debugger;

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _MediaEvents = require('./core/MediaEvents.js');

var _MediaEvents2 = _interopRequireDefault(_MediaEvents);

var _screenfull = require('screenfull');

var _screenfull2 = _interopRequireDefault(_screenfull);

var _Loader = require('./track/Loader.js');

var _Loader2 = _interopRequireDefault(_Loader);

var _TextTrack = require('./track/TextTrack.js');

var _TextTrack2 = _interopRequireDefault(_TextTrack);

var _Renderer = require('./track/Renderer.js');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _Debugger = require('./Debugger.js');

var _Debugger2 = _interopRequireDefault(_Debugger);

var _Title = require('./Title.js');

var _Title2 = _interopRequireDefault(_Title);

var _Playlist = require('./Playlist.js');

var _Playlist2 = _interopRequireDefault(_Playlist);

var _Slider = require('./component/Slider.js');

var _Slider2 = _interopRequireDefault(_Slider);

var _Tooltip = require('./component/Tooltip.js');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Checkbox = require('./component/Checkbox.js');

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _Utility = require('./Utility.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */
var HAS_TRACK_SUPPORT = 'track' in document.createElement('track');

/**
 * Creates new instances of the Moovie player.
 * @type {Class}
 */
// eslint-disable-line
var Moovie = new Class({
    Implements: [Options],

    options: {
        debugger: {},
        title: {},
        playlist: [],
        controls: {
            autohide: true,
            tooltips: true
        }
    },

    textTracks: [],

    initialize: function initialize(video, options) {
        this.setVideo(video);
        this.setOptions(options);

        this.build();
        this.attach();

        if (this.video.readyState >= this.video.HAVE_CURRENT_DATA) {
            if (this.video.buffered.length) {
                var buffered = this.video.buffered.end(this.video.buffered.length - 1);
                var percent = buffered / this.video.duration * 100;

                this.controls.seekbar.buffered.setStyle('width', percent + '%');
            }

            if (!this.video.autoplay) {
                this.container.set('data-playbackstate', 'stopped');
            }
        }
    },

    setVideo: function setVideo(video) {
        this.video = document.id(video);

        if (HAS_TRACK_SUPPORT) {
            for (var i = 0, l = this.video.textTracks; i < l; i++) {
                this.video.textTracks[i].mode = 'disabled';
            }
        }
    },

    loadTextTrack: function loadTextTrack(options) {
        var track = this.addTextTrack(options.kind, options.label, options.language || options.srclang);
        var loader = new _Loader2.default(options.src, options.srclang, track.addCue); // eslint-disable-line

        track.mode = options.default ? 'showing' : 'hidden';
    },

    addTextTrack: function addTextTrack(kind, label, language) {
        var track = new _TextTrack2.default(kind, label, language, this.video);

        this.textTracks.push(track);

        return track;
    },

    build: function build() {
        this.container = new Element('div.moovie');
        this.wrapper = new Element('div.wrapper');
        this.wrapper.wraps(this.video);
        this.container.wraps(this.wrapper);

        this.buildPlaylist();

        var current = this.playlist.current();

        this.renderer = new _Renderer2.default(window, this);
        this.overlay = new Element('div.overlay');
        this.title = new _Title2.default(this.options.title);
        this.title.update(current.title || (0, _Utility.basename)(current.src));
        this.debugger = new _Debugger2.default(this.video, this.options.debugger);

        this.buildPanels();
        this.buildControls();

        // Inject and do some post-processing --------------------------------------
        this.wrapper.adopt(this.renderer, this.overlay, this.title, this.panels, this.controls, this.debugger);

        // Adjust text-track renderer height to account for controls
        $(this.renderer).setStyle('bottom', this.controls.getSize().y);
    },

    attach: function attach() {
        var _this = this;

        // Unfortunately, the media API only defines one volume-related
        // event: `volumechange`. This event is fired whenever the media's
        // `volume` attribute changes, or the media's `muted` attribute
        // changes. The API defines no way to discern the two, so we'll
        // have to "manually" keep track. We need to do this in order to
        // be able to provide the advanced volume control (a la YouTube's
        // player): changing the volume can have an effect on the muted
        // state and vice versa.
        var muted = this.video.muted;

        this.playlist.addEvent('show', function () {
            _this.panels.update('none');
            _this.panels.set('aria-hidden', false);
        });

        this.playlist.addEvent('hide', function () {
            _this.panels.update('none');
            _this.panels.set('aria-hidden', true);
        });

        this.playlist.addEvent('select', function (current) {
            _this.textTracks.each(function (track) {
                track.mode = 'disabled'; // disables any event listeners
            }).empty();

            _this.panels.info.getElement('dt.title + dd').set('html', current.title || (0, _Utility.basename)(current.src));
            _this.panels.info.getElement('dt.url + dd').set('html', current.src);
            _this.title.update(current.title || (0, _Utility.basename)(current.src));
            _this.title.show();

            Array.convert(current.tracks).forEach(function (trackObj) {
                _this.loadTextTrack(trackObj);
            });

            _this.video.poster = current.poster;
            _this.video.src = current.src;
            _this.video.load();
            _this.video.play();
        });

        this.wrapper.addEvent('mouseenter', function () {
            _this.controls.show();
        });

        this.wrapper.addEvent('mouseleave', function () {
            if (_this.options.controls.autohide) {
                _this.controls.hide();
            }
        });

        this.overlay.addEvent('click', function () {
            _this.video.play();
            _this.title.show();
        });

        this.video.addEvents({
            click: function click() {
                _this.video.pause();
            },

            playing: function playing() {
                _this.container.set('data-playbackstate', 'playing');
            },

            pause: function pause() {
                _this.container.set('data-playbackstate', 'paused');
            },

            ended: function ended() {
                _this.container.set('data-playbackstate', 'ended');
                _this.playlist.next();
            },

            progress: function progress() {
                var percent = 0;

                if (_this.video.buffered.length) {
                    var buffered = _this.video.buffered.end(_this.video.buffered.length - 1);

                    percent = buffered / _this.video.duration * 100;
                }

                _this.controls.seekbar.buffered.setStyle('width', percent + '%');
                _this.panels.info.getElement('dt.size + dd').set('html', '0 MB');
            },

            seeking: function seeking() {
                _this.container.set('data-playbackstate', 'seeking');
            },

            seeked: function seeked() {
                // @bug pressing stop button still shows "seeking" state. This get around that.
                if (_this.video.paused) {
                    _this.container.set('data-playbackstate', 'paused');
                }
            },

            timeupdate: function timeupdate() {
                _this.controls.seekbar.slider.update(_this.video.currentTime);
                _this.controls.elapsed.set('text', (0, _Utility.formatSeconds)(_this.video.currentTime));
            },

            durationchange: function durationchange() {
                _this.controls.duration.set('text', (0, _Utility.formatSeconds)(_this.video.duration));
            },

            volumechange: function volumechange() {
                var video = _this.video;
                var mutedChanged = muted !== video.muted;

                muted = video.muted;

                // Un-muted with volume at 0 -- pick a sane default. This
                // is probably the only deviation from the way the YouTube
                // flash player handles volume control.
                if (mutedChanged && !video.muted && video.volume === 0) {
                    video.volume = 0.5;

                    // Volume changed while muted -> un-mute
                } else if (video.muted && video.volume !== 0 && !mutedChanged) {
                    video.muted = false;

                    // Slider dragged to 0 -> mute
                } else if (!mutedChanged && !video.muted && video.volume === 0) {
                    video.muted = true;
                }

                _this.controls.volume.set('data-muted', video.muted);
                _this.controls.volume.set('data-level', video.volume.round(2));

                // If muted, assume 0 for volume to visualize the muted state in
                // the slider as well. Don't actually change the volume, though,
                // so when un-muted, the slider simply goes back to its former value.
                _this.controls.volume.slider.update(video.muted && mutedChanged ? 0 : video.volume);
            },

            loadedmetadata: function loadedmetadata() {
                _this.container.set('data-playbackstate', 'stopped'); // or 'ready', or 'idle'
            }
        });
    },

    buildPlaylist: function buildPlaylist() {
        var _this2 = this;

        var video = this.video;
        var tracks = video.getChildren('track');
        var items = [];
        var serializedTracks = tracks.map(function (track) {
            track.removeAttribute('default'); // just to be safe
            return (0, _Utility.getAttributes)(track);
        });

        if (typeOf(this.options.playlist) === 'array') {
            items.combine(Array.convert(this.options.playlist));

            // Add the current video to the playlist stack
            items.unshift({
                id: video.get('id'),
                title: video.get('title') || (0, _Utility.basename)(video.currentSrc || video.src),
                src: video.currentSrc || video.src,
                tracks: serializedTracks
            });
        }

        serializedTracks.forEach(function (serializedTrack) {
            _this2.loadTextTrack(serializedTrack);
        });

        tracks.destroy();

        this.playlist = new _Playlist2.default(items);
    },

    buildPanels: function buildPanels() {
        this.panels = new Element('div.panels');
        this.panels.info = new Element('div.info', {
            html: '<div class="heading">Video information</div>\n            <dl>\n                <dt class="title">Title</dt>\n                <dd>' + this.playlist.current().title + '</dd>\n                <dt class="url">URL</dt>\n                <dd>' + this.video.src + '</dd>\n                <dt class="size">Size</dt>\n                <dd></dd>\n            </dl>'
        });

        this.panels.about = new Element('div.about', {
            html: '<div class="heading">About this player</div>\n            <p><strong>Moovie</strong> v0.4.3-<em>alpha</em></p>\n            <p>Copyright &copy; 2010, Colin Aarts</p>\n            <p><a href="http://colinaarts.com/code/moovie/" rel="external">http://colinaarts.com/code/moovie/</a></p>'
        });

        this.panels.update = function (which) {
            if (which === 'none' || this[which].hasClass('active')) {
                this.getChildren('.active').removeClass('active');
                this.set('aria-hidden', true);
            } else {
                this.getChildren().removeClass('active');
                this[which].addClass('active');
                this.set('aria-hidden', false);
            }
        };

        this.panels.adopt(this.panels.info, this.panels.about, this.playlist);
        this.panels.set('aria-hidden', true);
    },

    buildControls: function buildControls() {
        var _this3 = this;

        this.controls = new Element('div.controls');
        this.controls.tooltip = new _Tooltip2.default(this.controls);

        this.controls.play = new Element('div.play[aria-label=Play Video]');
        this.controls.play.addEvent('click', function () {
            if (_this3.video.paused && _this3.video.readyState >= 3) {
                _this3.video.play();
            } else if (!_this3.video.paused && _this3.video.ended) {
                _this3.video.currentTime = 0;
            } else if (!_this3.video.paused) {
                _this3.video.pause();
            }
        });

        this.controls.stop = new Element('div.stop[aria-label=Stop Video]');
        this.controls.stop.addEvent('click', function () {
            _this3.video.currentTime = 0;
            _this3.video.pause();
        });

        this.controls.previous = new Element('div.previous[aria-label=Previous Video]');
        this.controls.previous.addEvent('click', function () {
            _this3.playlist.previous();
        });

        this.controls.next = new Element('div.next[aria-label=Next Video]');
        this.controls.next.addEvent('click', function () {
            _this3.playlist.next();
        });

        this.controls.elapsed = new Element('div.elapsed[text=0:00]');
        this.controls.seekbar = this.createSeekbar();
        this.controls.duration = new Element('div.duration[text=0:00]');
        this.controls.volume = this.createVolumeControl();
        this.controls.settings = this.createSettingsControl();
        this.controls.more = this.createMoreControl();
        this.controls.fullscreen = new Element('div.fullscreen[aria-label=Enter Fullscreen]');
        this.controls.fullscreen.addEvent('click', function () {
            _screenfull2.default.toggle(_this3.wrapper);
        });

        this.controls.adopt(this.controls.play, this.controls.stop, this.controls.previous, this.controls.next, this.controls.elapsed, this.controls.seekbar, this.controls.duration, this.controls.volume, this.controls.settings, this.controls.more, this.controls.fullscreen, this.controls.tooltip);

        this.video.controls = false; // disable native controls

        this.controls.show = function () {
            return this.set('aria-hidden', false);
        };

        this.controls.hide = function () {
            return this.set('aria-hidden', true);
        };

        this.controls.elapsed.set('text', (0, _Utility.formatSeconds)(this.video.currentTime || 0));
        this.controls.duration.set('text', (0, _Utility.formatSeconds)(this.video.duration || 0));
    },

    createSeekbar: function createSeekbar() {
        var video = this.video;
        var seekbar = new Element('div.seekbar');
        var wasPlaying = !(video.paused || video.ended);

        seekbar.slider = new _Slider2.default({
            min: 0,
            max: video.duration,
            value: video.currentTime,
            onStart: function onStart(val) {
                wasPlaying = !(video.paused || video.ended);
                video.pause();
                video.currentTime = val === video.duration ? val - 1 : val;
            },
            onMove: function onMove(val) {
                video.currentTime = val === video.duration ? val - 1 : val;
            },
            onStop: function onStop() {
                // resume playing only if video was playing before we started seeking
                if (wasPlaying) {
                    video.play();
                }
            }
        });

        seekbar.tooltip = new _Tooltip2.default(seekbar.slider);
        seekbar.tooltip.detach(); // we don't want to use the disable() method here

        $(seekbar.slider).addEvents({
            mousemove: function mousemove(event) {
                var position = event.page.x - seekbar.slider.track.getLeft();
                var limit = seekbar.slider.track.getSize().x;
                var time = (0, _Utility.formatSeconds)(position / limit * video.duration);

                if (event.target !== seekbar.slider.thumb) {
                    $(seekbar.tooltip).set('text', time);
                    $(seekbar.tooltip).setStyle('left', position);
                    seekbar.tooltip.show();
                }
            },

            mouseleave: function mouseleave() {
                seekbar.tooltip.hide();
            }
        });

        $(seekbar.slider.thumb).addEvents({
            mouseenter: function mouseenter() {
                var position = seekbar.slider.fill.getSize().x;
                var limit = seekbar.slider.track.getSize().x;
                var time = position / limit * video.duration;

                $(seekbar.tooltip).set('text', (0, _Utility.formatSeconds)(time));
                $(seekbar.tooltip).setStyle('left', position);
                seekbar.tooltip.show();
            },

            mouseleave: function mouseleave() {
                seekbar.tooltip.hide();
            }
        });

        seekbar.buffered = new Element('div.seekbar-buffered');
        seekbar.buffered.inject(seekbar.slider.track, 'after');
        seekbar.adopt(seekbar.slider, seekbar.tooltip);

        return seekbar;
    },

    createVolumeControl: function createVolumeControl() {
        var video = this.video;
        var volume = new Element('div.volume[aria-label=Mute Audio]');

        volume.addEvent('click', function () {
            video.muted = !video.muted;
        });

        volume.popup = new Element('div.popup');
        volume.popup.addEvent('click', function () {
            // stop child elements from triggering the mute when clicked
            return false;
        });

        volume.slider = new _Slider2.default({
            min: 0,
            max: 1,
            value: video.volume,
            orientation: 'vertical',
            onMove: function onMove(val) {
                video.volume = val;
            }
        });

        volume.popup.grab(volume.slider);
        volume.grab(volume.popup);

        return volume;
    },

    createSettingsControl: function createSettingsControl() {
        var self = this;
        var settings = new Element('div.settings[aria-label="View Settings"]');

        settings.popup = new Element('div.popup');
        settings.toggleControls = new _Checkbox2.default('autohide', {
            label: 'Autohide Controls',
            checked: this.options.controls.autohide,
            onChange: function onChange() {
                self.options.controls.autohide = this.checked;
            }
        });

        settings.loopVideo = new _Checkbox2.default('loop', {
            label: 'Loop video',
            checked: this.video.loop,
            onChange: function onChange() {
                self.video.loop = this.checked;
                self.panels.update('none');
            }
        });

        settings.renderTextTracks = new _Checkbox2.default('renderer', {
            label: 'Render text-tracks',
            checked: !this.renderer.disabled,
            onChange: function onChange() {
                self.renderer[this.checked ? 'enable' : 'disable']();
                self.panels.update('none');
            }
        });

        settings.enableDebugger = new _Checkbox2.default('debugger', {
            label: 'Enable Debugger',
            checked: !this.debugger.disabled,
            onChange: function onChange() {
                self.debugger[this.checked ? 'enable' : 'disable']();
                self.panels.update('none');
            }
        });

        settings.popup.adopt(settings.toggleControls, settings.loopVideo, settings.renderTextTracks, settings.enableDebugger);

        settings.grab(settings.popup);

        return settings;
    },

    createMoreControl: function createMoreControl() {
        var playlist = this.playlist;
        var panels = this.panels;
        var more = new Element('div.more[aria-label="Show More Popup"]');

        more.popup = new Element('div.popup');
        more.about = new Element('div.about[aria-label=About Moovie]');
        more.about.addEvent('click', function () {
            panels.update('about');
        });

        more.info = new Element('div.info[aria-label=View Video Info]');
        more.info.addEvent('click', function () {
            panels.update('info');
        });

        more.playlist = new Element('div.playlist[aria-label=Open Playlist]');
        more.playlist.addEvent('click', function () {
            if (playlist.hidden) {
                playlist.show();
            } else {
                playlist.hide();
            }
        });

        more.popup.adopt(more.about, more.info, more.playlist);
        more.grab(more.popup);

        return more;
    }
});

Element.implement({
    // method to polyfill <video> tags
    toMoovie: function toMoovie(options) {
        this.store('moovie', new Moovie(this, options));
    }
});

exports.default = Moovie;

},{"./Debugger.js":9,"./Playlist.js":11,"./Title.js":12,"./Utility.js":13,"./component/Checkbox.js":14,"./component/Slider.js":15,"./component/Tooltip.js":16,"./core/MediaEvents.js":17,"./track/Loader.js":19,"./track/Renderer.js":20,"./track/TextTrack.js":21,"screenfull":2}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _Utility = require('./Utility.js');

/**
 * Manages lists of videos inside of Moovie.
 * @type {Class}
 */
var Playlist = new Class({
    Implements: [Events, Options],

    options: {/*
              onShow: function () {},
              onHide: function () {},
              onSelect: function () {},*/
    },

    initialize: function initialize(items) {
        this.items = typeOf(items) === 'array' ? items : [];
        this.index = this.items.length ? 0 : -1;
        this.handle = this.handle.bind(this);
        this.build().attach().hide();
    },

    attach: function attach() {
        this.element.addEvent('click:relay(.label)', this.handle);

        return this;
    },

    detach: function detach() {
        this.element.removeEvent('click:relay(.label)', this.handle);

        return this;
    },

    build: function build() {
        var _this = this;

        this.element = new Element('div.playlist', {
            html: '<div><div class="heading">Playlist</div></div><div><ol class="playlist"></ol></div>'
        });

        this.items.each(function (item, index) {
            _this.element.getElement('ol.playlist').grab(new Element('li', {
                'data-index': index,
                'class': _this.current() === item ? 'active' : '',
                'html': '<div class="checkbox-widget" data-checked="true">\n                        <div class="checkbox"></div>\n                        <div class="label">' + (item.title || (0, _Utility.basename)(item.src)) + '</div>\n                    </div>'
            }));
        });

        return this;
    },

    active: function active() {
        return this.element.getElement('ol.playlist li.active');
    },

    show: function show() {
        this.hidden = false;
        this.element.set('aria-hidden', false);
        this.fireEvent('show');
        this.element.addClass('active');

        return this;
    },

    hide: function hide() {
        this.hidden = true;
        this.element.set('aria-hidden', true);
        this.fireEvent('hide');
        this.element.removeClass('active');

        return this;
    },

    size: function size() {
        return this.items.length;
    },

    current: function current() {
        return this.items[this.index] || null;
    },

    hasPrevious: function hasPrevious() {
        return this.index > 0;
    },

    previous: function previous() {
        return this.select(this.index - 1);
    },

    hasNext: function hasNext() {
        return this.index < this.items.length - 1;
    },

    next: function next() {
        return this.select(this.index + 1);
    },

    select: function select(index) {
        if (index >= 0 && index < this.items.length) {
            this.index = index;
            this.active().removeClass('active');
            this.element.getElement('ol.playlist li[data-index="' + index + '"]').addClass('active');
            this.fireEvent('select', this.current());
        }

        return this;
    },

    isHidden: function isHidden() {
        return this.hidden;
    },

    toElement: function toElement() {
        return this.element;
    },

    handle: function handle(event) {
        var item = event.target.getParent('li');
        var index = item.get('data-index').toInt();

        event.stop();
        this.select(index);
        this.hide();
    }
}); /**
     * Moovie: an advanced HTML5 video player for MooTools.
     * @copyright 2010 Colin Aarts
     * @license MIT
     */
exports.default = Playlist;

},{"./Utility.js":13}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */

/**
 * Displays the title of the currently playing video.
 * @type {Class}
 */
var Title = new Class({
    Implements: [Events, Options],

    options: { /*
               onShow: function () {},
               onHide: function () {},*/
        autohide: true,
        delay: 6000,
        hidden: true,
        content: ''
    },

    initialize: function initialize(options) {
        this.setOptions(options).build();
        this[this.options.hidden ? 'hide' : 'show']();
    },

    build: function build() {
        this.element = new Element('div.moovie-title');
        this.element.set('html', this.options.content);

        return this;
    },

    update: function update(content) {
        this.element.set('html', content);

        return this;
    },

    show: function show() {
        this.hidden = false;
        this.element.set('aria-hidden', false);
        this.fireEvent('show');

        // prevents a whole host of bugs
        if (this.id) {
            clearTimeout(this.id); // eslint-disable-line no-undef
        }

        if (this.options.autohide) {
            this.id = this.hide.delay(this.options.delay, this);
        }

        return this;
    },

    hide: function hide() {
        this.hidden = true;
        this.element.set('aria-hidden', true);
        this.fireEvent('hide');

        return this;
    },

    isHidden: function isHidden() {
        return this.hidden;
    },

    toElement: function toElement() {
        return this.element;
    }
});

exports.default = Title;

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */

/**
 * Strip directory and suffix from filenames.
 * @link http://locutus.io/php/basename/
 * @author Kevin van Zonneveld (http://kvz.io)
 * @author Ash Searle (http://hexmen.com/blog/)
 * @author Lincoln Ramsay
 * @author djmix
 * @author Dmitry Gorelenkov
 * @param  {string} path   [description]
 * @param  {string} suffix If specified, removes suffix from returned string.
 * @return {string}        [description]
 */
var basename = function basename(path, suffix) {
    var b = path;
    var lastChar = b.charAt(b.length - 1);

    if (lastChar === '/' || lastChar === '\\') {
        b = b.slice(0, -1);
    }

    b = b.replace(/^.*[\/\\]/g, '');

    if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
        b = b.substr(0, b.length - suffix.length);
    }

    return b;
};

// as usual, add polyfills for IE
Number.isNaN = Number.isNaN || function (value) {
    return typeof value === 'number' && isNaN(value);
};

Number.isFinite = Number.isFinite || function (value) {
    return typeof value === 'number' && isFinite(value);
};

/**
 * Converts a floating point value into a time string.
 * @param  {Number} value A floating point value represented as seconds.milliseconds.
 * @return {string} A string formatted to either: hh:mm:ss or mm:ss or m:ss
 */
var formatSeconds = function formatSeconds(value) {
    var input = Math.round(value);
    var hours = Math.floor(input / 3600);
    var minutes = Math.floor(input % 3600 / 60);
    var seconds = input % 3600 % 60;

    if (Number.isNaN(value) || !Number.isFinite(value)) {
        return '-:--';
    }

    if (value < 0) {
        return '0:00';
    }

    hours = hours > 0 ? hours + ':' : '';
    minutes = (hours && minutes < 10 ? '0' + minutes : minutes) + ':';
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + minutes + seconds;
};

/**
 * Retrieve attributes from an element.
 * @param  {Element} element An Element instance.
 * @return {Object} An object containing all defined element attributes.
 */
var getAttributes = function getAttributes(element) {
    var attributes = {};

    Array.convert(element.attributes).forEach(function (attribute) {
        attributes[attribute.name] = attribute.value;
    });

    return attributes;
};

/**
 * Polls the DOM periodically to check for the existance of an element.
 * @see https://davidwalsh.name/javascript-polling
 * @param  {Element}  element   The Element instance to check for.
 * @param  {Function} onsuccess Called if the element was found before the timeout expired.
 * @param  {Function} onerror   Called if the element was not found and the timeout has expired.
 * @param  {Number}   timeout   How long to poll the DOM for. (Default is 2 seconds)
 * @return {undefined}
 */
var isInDOM = function isInDOM(element, onsuccess, onerror, timeout) {
    var expiry = Date.now() + (timeout || 2000);
    var condition = function condition() {
        return document.body.contains(element);
    };

    (function poller() {
        // If the condition was met, we're done!
        if (condition()) {
            onsuccess();

            // If the condition wasn't met and the timeout hasn't elapsed, try again.
        } else if (Date.now() < expiry) {
            setTimeout(poller, 100);

            // Condition wasn't matched and too much time elapsed, reject!
        } else {
            onerror(new Error('Element could not be found in DOM before timeout occurred.'));
        }
    })();

    // @todo return Promise
};

exports.basename = basename;
exports.formatSeconds = formatSeconds;
exports.getAttributes = getAttributes;
exports.isInDOM = isInDOM;

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */
var Checkbox = new Class({
    Implements: [Events, Options],

    options: { /*
               onCheck: function () {},
               onUncheck: function () {},
               onChange: function () {},*/
        label: '',
        checked: false
    },

    /**
     * Creates a new instance of `Checkbox`.
     * @param  {string} name    The name of the checkbox. This MUST be unique.
     * @param  {object} options An object hash of options to further customize the checkbox.
     * @return {undefined}
     */
    initialize: function initialize(name, options) {
        this.name = name;
        this.setOptions(options);
        this.toggle = this.toggle.bind(this);
        this.build().attach();
        this[this.options.checked ? 'check' : 'uncheck']();
    },

    /**
     * Builds the DOM structure that will be injected into the browser.
     * @return {Checkbox} The current instance for method chaining.
     */
    build: function build() {
        this.element = new Element('div', {
            'class': 'moovie-checkbox',
            'data-label': this.options.label || this.name,
            'data-name': this.name
        });

        return this;
    },

    /**
     * Attach event listeners, this allows the checkbox to be toggled.
     * @return {Checkbox} The current instance for method chaining.
     */
    attach: function attach() {
        this.element.addEvent('click', this.toggle);

        return this;
    },

    /**
     * Detach event listeners, this prevents the checkbox from being toggled.
     * @return {Checkbox} The current instance for method chaining.
     */
    detach: function detach() {
        this.element.removeEvent('click', this.toggle);

        return this;
    },

    /**
     * Set the checkbox to the "checked" state.
     * @return {Checkbox} The current instance for method chaining.
     */
    check: function check() {
        this.checked = true;
        this.element.set('aria-checked', true);
        this.fireEvent('check');

        return this;
    },

    /**
     * Set the checkbox to the "unchecked" state.
     * @return {Checkbox} The current instance for method chaining.
     */
    uncheck: function uncheck() {
        this.checked = false;
        this.element.set('aria-checked', false);
        this.fireEvent('uncheck');

        return this;
    },

    /**
     * Convert the class to an element for use in DOM operations.
     * @return {Element} The "checkbox" element.
     */
    toElement: function toElement() {
        return this.element;
    },

    /**
     * Toggle to either the "checked" or "unchecked" state based on the current state.
     * @return {undefined}
     */
    toggle: function toggle() {
        this[this.checked ? 'uncheck' : 'check']().fireEvent('change');
    },

    /**
     * Checks if the checkbox is currently in the "checked" state.
     * @return {boolean} `true` if the checkbox is in the "checked" state.
     */
    isChecked: function isChecked() {
        return this.checked;
    }
});

exports.default = Checkbox;

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Utility = require('../Utility.js');

/**
 * [Slider description]
 * @type {Class}
 */
var Slider = new Class({
    Implements: [Events, Options],

    options: { /*
               onStart: function (val, pos) {},
               onMove: function (val, pos) {},
               onStop: function (val, pos) {},
               onChange: function (val) {},
               onUpdate: function (pos) {},*/
        value: 0,
        min: 0,
        max: 100,
        orientation: 'horizontal'
    },

    /**
     * Creates a new instance of `Slider`.
     * @param  {object} options An object hash of options to further customize the checkbox.
     * @return {undefined}
     */
    initialize: function initialize(options) {
        var _this = this;

        this.setOptions(options);
        this.axis = this.options.orientation === 'vertical' ? 'y' : 'x';
        this.dimensionModifier = this.axis === 'y' ? 'height' : 'width';
        this.positionModifier = this.axis === 'y' ? 'bottom' : 'left';
        this.dragging = false;
        this.build().bindListeners().attach();

        (0, _Utility.isInDOM)(this.element, function () {
            _this.update(_this.options.value);
        });
    },

    /**
     * Builds the DOM structure that will be injected into the browser.
     * @return {Slider} The current instance for method chaining.
     */
    build: function build() {
        this.element = new Element('div.moovie-slider');
        this.track = new Element('div.slider-track');
        this.fill = new Element('div.slider-fill');
        this.thumb = new Element('div.slider-thumb');

        this.element.set('aria-orientation', this.options.orientation);
        this.element.adopt(this.track, this.fill, this.thumb);

        return this;
    },

    /**
     * Bind the methods used by the event handlers, to the current instance.
     * @return {Slider} The current instance for method chaining.
     */
    bindListeners: function bindListeners() {
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.stop = this.stop.bind(this);

        return this;
    },

    /**
     * Attach event listeners, this allows the slider to be dragged.
     * @return {Slider} The current instance for method chaining.
     */
    attach: function attach() {
        this.element.addEvent('mousedown', this.start);

        return this;
    },

    /**
     * Detach event listeners, this prevents the slider from being dragged.
     * @return {Slider} The current instance for method chaining.
     */
    detach: function detach() {
        this.element.removeEvent('mousedown', this.start);

        return this;
    },

    /**
     * Handles the "mousedown" event.
     * @param  {object} event The "mousedown" event.
     * @return {Boolean} Stop event propagation and default action.
     */
    start: function start(event) {
        if (event.rightClick) {
            return false;
        }

        document.addEvent('mousemove', this.move);
        document.addEvent('mouseup', this.stop);

        this.setPositionFromEvent(event);
        this.setValueFromPosition(this.position);

        this.dragging = true;
        this.fireEvent('start', [this.value, this.position]);

        return false;
    },

    /**
     * Handles the "mousemove" event.
     * @param  {object} event The "mousemove" event.
     * @return {undefined}
     */
    move: function move(event) {
        this.setPositionFromEvent(event);
        this.setValueFromPosition(this.position);
        this.fireEvent('move', [this.value, this.position]);
    },

    /**
     * Handles the "mouseup" event.
     * @return {undefined}
     */
    stop: function stop() {
        document.removeEvent('mousemove', this.move);
        document.removeEvent('mouseup', this.stop);

        this.dragging = false;
        this.fireEvent('stop', [this.value, this.position]);
    },

    /**
     * Update the position of the slider's thumb/fill bar.
     * @param  {number} value A float value between `options.min` and `options.max`.
     * @return {Slider} The current instance for method chaining.
     */
    update: function update(value) {
        this.setValue(value);
        this.setPositionFromValue(this.value);

        return this;
    },

    /**
     * Convert the class to an element for use in DOM operations.
     * @return {Element} The "slider" element.
     */
    toElement: function toElement() {
        return this.element;
    },

    /**
     * Converts a value from one range into a value from another range.
     * @param  {number} oldMin The lower threshold of the old range.
     * @param  {number} oldMax The upper threshold of the old range.
     * @param  {number} newMin The lower threshold of the new range.
     * @param  {number} newMax The upper threshold of the new range.
     * @param  {number} value  The value of the old range.
     * @return {number} The value of the new range.
     */
    toNewRange: function toNewRange(oldMin, oldMax, newMin, newMax, value) {
        var oldRange = oldMax - oldMin;
        var newRange = newMax - newMin;
        var ratio = newRange / oldRange;

        return value * ratio + newMin;
    },

    /**
     * Set the slider's value from the position of the thumb/fill bar.
     * @param {number} position A value between `0` and the slider's track size.
     * @return {undefined}
     */
    setValueFromPosition: function setValueFromPosition(position) {
        var limit = this.track.getSize()[this.axis];

        this.setValue(this.toNewRange(0, limit, this.options.min, this.options.max, position));
    },

    /**
     * Set the slider's thumb/fill bar position from an arbitrary value.
     * @param {number} value A value between `options.min` and `options.max`.
     * @return {undefined}
     */
    setPositionFromValue: function setPositionFromValue(value) {
        var limit = this.track.getSize()[this.axis];

        this.setPosition(this.toNewRange(this.options.min, this.options.max, 0, limit, value));
    },

    /**
     * Sets the position of the thumb/fill bar based on the mouses' position within the document.
     * @param {object} event Either a "mousedown" or a "mousemove" event.
     * @return {undefined}
     */
    setPositionFromEvent: function setPositionFromEvent(event) {
        var limit = this.track.getSize()[this.axis];
        var position = event.page[this.axis] - this.track.getPosition()[this.axis];

        this.setPosition(this.axis === 'y' ? limit - position : position);
    },

    /**
     * Set the position of the thumb/fill bar.
     * @param {number} position A value between `0` and the slider's track size.
     * @return {undefined}
     */
    setPosition: function setPosition(position) {
        var limit = this.track.getSize()[this.axis];

        this.position = position.limit(0, limit);
        this.fill.setStyle(this.dimensionModifier, this.position);
        this.thumb.setStyle(this.positionModifier, this.position);
        this.fireEvent('update', this.position);
    },

    /**
     * Set the slider's value.
     * @param {number} value A value between `options.min` and `options.max`.
     * @return {undefined}
     */
    setValue: function setValue(value) {
        this.value = value.limit(this.options.min, this.options.max);
        this.fireEvent('change', this.value);
    }
}); /**
     * Moovie: an advanced HTML5 video player for MooTools.
     * @copyright 2010 Colin Aarts
     * @license MIT
     */
exports.default = Slider;

},{"../Utility.js":13}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */

/**
 * Component for creating aria-enabled tooltip elements.
 * @type {Class}
 */
var Tooltip = new Class({
    Implements: [Events, Options],

    options: { /*
               onShow: function () {},
               onHide: function () {},*/
        hidden: true,
        disabled: false,
        axis: 'both', // 'none', x', 'y', 'both'
        content: function content(element) {
            // condition
            return element.get('aria-label');
        }
    },

    /**
     * Creates a new instance of `Tooltip`.
     * @param  {Element} target [description]
     * @param  {Object} options An object hash of options to further customize the Tooltip.
     * @return {undefined}
     */
    initialize: function initialize(target, options) {
        this.target = document.id(target);
        this.setOptions(options);
        this.build().bindListeners();
        this[this.options.disabled ? 'disable' : 'enable']();
        this[this.options.hidden ? 'hide' : 'show']();
    },

    /**
     * Bind the methods used by the event handlers to the current instance.
     * @return {Tooltip} The current instance for method chaining.
     */
    bindListeners: function bindListeners() {
        this.update = this.update.bind(this);
        this.hide = this.hide.bind(this);

        return this;
    },

    /**
     * Builds the DOM structure that will be injected into the browser.
     * @return {Tooltip} The current instance for method chaining.
     */
    build: function build() {
        this.element = new Element('div', {
            'class': 'moovie-tooltip',
            'aria-hidden': this.options.hidden,
            'aria-disabled': this.options.disabled,
            'role': 'tooltip'
        });

        return this;
    },

    /**
     * Attach event listeners.
     * @return {Tooltip} The current instance for method chaining.
     */
    attach: function attach() {
        this.target.addEvent('mousemove', this.update);
        this.target.addEvent('mouseleave', this.hide);

        return this;
    },

    /**
     * Detach event listeners.
     * @return {Tooltip} The current instance for method chaining.
     */
    detach: function detach() {
        this.target.removeEvent('mousemove', this.update);
        this.target.removeEvent('mouseleave', this.hide);

        return this;
    },

    /**
     * Allows the tooltip to track the mouse or autoshow when hovering over a target.
     * @return {Tooltip} The current instance for method chaining.
     */
    enable: function enable() {
        this.disabled = false;
        this.element.set('aria-disabled', false);
        this.attach();

        return this;
    },

    /**
     * Prevent the tooltip from tracking the mouse or autoshowing when hovering over a target.
     * @return {Tooltip} The current instance for method chaining.
     */
    disable: function disable() {
        this.disabled = true;
        this.element.set('aria-disabled', true);
        this.detach().hide();

        return this;
    },

    /**
     * Shows the tooltip.
     * @return {Tooltip} The current instance for method chaining.
     */
    show: function show() {
        this.hidden = false;
        this.element.set('aria-hidden', false);
        this.fireEvent('show');

        return this;
    },

    /**
     * Hides the tooltip
     * @return {Tooltip} The current instance for method chaining.
     */
    hide: function hide() {
        this.hidden = true;
        this.element.set('aria-hidden', true);
        this.fireEvent('hide');

        return this;
    },

    /**
     * Convert the class to an element representation for use in DOM operations.
     * @return {Element} The "tooltip" element.
     */
    toElement: function toElement() {
        return this.element;
    },

    /**
     * Handles the "mousemove" event.
     * @param  {Object} event The "mousemove" event.
     * @return {undefined}
     */
    update: function update(event) {
        var content = this.options.content.call(this, event.target);

        if (content) {
            this.element.set('html', content);

            if (['x', 'both'].contains(this.options.axis)) {
                this.element.setStyle('left', event.page.x - this.target.getLeft());
            }

            if (['y', 'both'].contains(this.options.axis)) {
                this.element.setStyle('top', event.page.y - this.target.getTop());
            }

            this.show();
        } else {
            this.hide();
        }
    }
});

exports.default = Tooltip;

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _emune = require('emune');

var _emune2 = _interopRequireDefault(_emune);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Global events used by the `<video>` tag.
 * @enum {string}
 * @readonly
 */
var MediaEvents = new _emune2.default({
    abort: 'abort',
    canplay: 'canplay',
    canplaythrough: 'canplaythrough',
    durationchange: 'durationchange',
    emptied: 'emptied',
    ended: 'ended',
    error: 'error',
    loadeddata: 'loadeddata',
    loadedmetadata: 'loadedmetadata',
    loadstart: 'loadstart',
    pause: 'pause',
    play: 'play',
    playing: 'playing',
    progress: 'progress',
    ratechange: 'ratechange',
    seeked: 'seeked',
    seeking: 'seeking',
    stalled: 'stalled',
    suspend: 'suspend',
    timeupdate: 'timeupdate',
    volumechange: 'volumechange',
    waiting: 'waiting'
});

// Add HTML5 media events to MooTools, if needed.
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */
if (!Element.NativeEvents.timeupdate) {
    Element.NativeEvents = Object.merge(Element.NativeEvents, MediaEvents);
}

exports.default = MediaEvents;

},{"emune":1}],18:[function(require,module,exports){
'use strict';

/* eslint-env node */
module.exports = require('./Moovie.js').default;

},{"./Moovie.js":10}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _WebSRT = require('./WebSRT.js');

var _vtt = require('vtt.js');

/**
 * Loads and parses the track based on the filetype.
 * @type {Class}
 */
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */
var Loader = new Class({
    initialize: function initialize(url, srclang, onCue) {
        this.url = url;
        this.srclang = srclang;
        this.onCue = onCue;
        this.sendRequest();
    },

    sendRequest: function sendRequest() {
        var _this = this;

        // @todo sort out crossorigin attribute/property as well...
        var request = new Request({
            url: this.url,

            onSuccess: function onSuccess(data) {
                var parser = _this.getParser(_this.url.split('.').pop());

                parser.oncue = function (cue) {
                    _this.onCue(cue);
                };

                parser.parse(data);
                parser.flush();
            }
        });

        request.send();
    },

    getParser: function getParser(ext) {
        if (ext === 'srt') {
            return new _WebSRT.WebSRT.Parser();
        } else if (ext === 'vtt') {
            return new _vtt.WebVTT.Parser(window, _vtt.WebVTT.StringDecoder());
        }

        throw new Error('Unsupported file type: ' + ext);
    }
});

exports.default = Loader;

},{"./WebSRT.js":24,"vtt.js":3}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vtt = require('vtt.js');

/**
 * Render active text track cues inside of a DOM element.
 * @type {Class}
 */
var Renderer = new Class({
    Implements: [Events, Options],

    options: {
        'bottom': 0,
        'left': 0,
        'pointer-events': 'none',
        'position': 'absolute',
        'right': 0,
        'top': 0
    },

    initialize: function initialize(context, instance, options) {
        this.context = context;
        this.media = instance.video;
        this.textTracks = instance.textTracks;
        this.process = this.process.bind(this);
        this.setOptions(options);
        this.build().enable();
    },

    build: function build() {
        this.element = new Element('div');
        this.element.setStyles(this.options);

        return this;
    },

    attach: function attach() {
        this.media.addEvent('timeupdate', this.process);

        return this;
    },

    detach: function detach() {
        this.media.removeEvent('timeupdate', this.process);

        return this;
    },

    enable: function enable() {
        this.disabled = false;
        this.element.setStyle('display', 'block');
        this.attach();

        return this;
    },

    disable: function disable() {
        this.disabled = true;
        this.element.setStyle('display', 'none');
        this.detach();

        return this;
    },

    process: function process() {
        _vtt.WebVTT.processCues(this.context, this.textTracks.map(function (track) {
            return track.activeCues;
        }).flatten(), this.element);

        return this;
    },

    toElement: function toElement() {
        return this.element;
    }
}); /**
     * Moovie: an advanced HTML5 video player for MooTools.
     * @copyright 2010 Colin Aarts
     * @license MIT
     */
exports.default = Renderer;

},{"vtt.js":3}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _TextTrackKind = require('./TextTrackKind.js');

var _TextTrackKind2 = _interopRequireDefault(_TextTrackKind);

var _TextTrackMode = require('./TextTrackMode.js');

var _TextTrackMode2 = _interopRequireDefault(_TextTrackMode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Provides a basic implementation of the W3C TextTrack IDL.
 */
/**
 * Moovie: an advanced HTML5 video player for MooTools.
 * @copyright 2010 Colin Aarts
 * @license MIT
 */
var TextTrack = function TextTrack(kind, label, language, media) {
    var cues = [];
    var activeCues = [];
    var mode = _TextTrackMode2.default.disabled;

    if (!kind) {
        kind = 'subtitles'; // missing value default
    } else if (!(kind in _TextTrackKind2.default)) {
        kind = 'metadata'; // invalid value default
    }

    if (!language) {
        language = 'english';
    }

    if (!label) {
        label = kind + '-' + language;
    }

    // @todo disable events when "mode" is equal to "disabled"
    media.addEvent('timeupdate', function () {
        var processingTime = 0.39;
        var time = media.currentTime + processingTime;
        var i = 0;

        // cueexit
        i = activeCues.length;
        while (i--) {
            if (activeCues[i].startTime > time || activeCues[i].endTime < time) {
                if (activeCues[i].pauseOnExit) {
                    media.pause();
                }

                activeCues.splice(i, 1);
            }
        }

        // cueenter
        i = cues.length;
        while (i--) {
            if (cues[i].startTime <= time && cues[i].endTime >= time) {
                activeCues.include(cues[i]);
            }
        }
    });

    Object.defineProperties(this, {
        kind: {
            get: function get() {
                return kind;
            }
        },

        label: {
            get: function get() {
                return label;
            }
        },

        language: {
            get: function get() {
                return language;
            }
        },

        id: {
            get: function get() {
                return '';
            }
        },

        inBandMetadataTrackDispatchType: {
            get: function get() {
                return '';
            }
        },

        mode: {
            get: function get() {
                return mode;
            },

            set: function set(value) {
                if (value in _TextTrackMode2.default) {
                    mode = value;
                }
            }
        },

        cues: {
            get: function get() {
                return cues;
            }
        },

        activeCues: {
            get: function get() {
                return activeCues;
            }
        },

        addCue: {
            value: function value(cue) {
                cues.push(cue);
            }
        },

        removeCue: {
            value: function value(cue) {
                cues.remove(cue);
            }
        },

        oncuechange: {
            value: Function.from()
        }
    });
};

exports.default = TextTrack;

},{"./TextTrackKind.js":22,"./TextTrackMode.js":23}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _emune = require('emune');

var _emune2 = _interopRequireDefault(_emune);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * W3C TextTrackKind IDL export.
 * @see https://w3c.github.io/html/semantics-embedded-content.html#enumdef-texttrack-texttrackkind
 * @enum {string}
 * @readonly
 */
var TextTrackKind = new _emune2.default({
  subtitles: 'subtitles',
  captions: 'captions',
  descriptions: 'descriptions',
  chapters: 'chapters',
  metadata: 'metadata'
}); /**
     * Moovie: an advanced HTML5 video player for MooTools.
     * @copyright 2010 Colin Aarts
     * @license MIT
     */
exports.default = TextTrackKind;

},{"emune":1}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _emune = require('emune');

var _emune2 = _interopRequireDefault(_emune);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * W3C TextTrackMode IDL export.
 * @see https://w3c.github.io/html/semantics-embedded-content.html#enumdef-texttrack-texttrackmode
 * @enum {string}
 * @readonly
 */
var TextTrackMode = new _emune2.default({
  disabled: 'disabled',
  hidden: 'hidden',
  showing: 'showing'
}); /**
     * Moovie: an advanced HTML5 video player for MooTools.
     * @copyright 2010 Colin Aarts
     * @license MIT
     */
exports.default = TextTrackMode;

},{"emune":1}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SRTCue = exports.WebSRT = undefined;

var _vtt = require('vtt.js');

/**
 * Provides an SRTCue object for the WebSRT parser. While the SRT standard
 * doesn't really support any of the VTT properties, it does make it easier to
 * process both .srt and .vtt inside Moovie when vtt.js uses the same cue type.
 * @type {SRTCue}
 */
var SRTCue = _vtt.VTTCue; /**
                           * Moovie: an advanced HTML5 video player for MooTools.
                           * @copyright 2010 Colin Aarts
                           * @license MIT
                           */

var WebSRT = {};

/**
 * Parses SRT (.srt) files.
 * @type {Class}
 */
WebSRT.Parser = new Class({
    initialize: function initialize() {
        this.oncue = Function.from();
        this.onflush = Function.from();
        this.onparsingerror = Function.from();
        this.buffer = '';
        this.cues = [];
    },

    computeSeconds: function computeSeconds(h, m, s, f) {
        var hours = h.toInt() * 3600;
        var minutes = m.toInt() * 60;
        var seconds = s.toInt();
        var milliseconds = f.toInt() / 1000;

        return hours + minutes + seconds + milliseconds;
    },

    // Timestamp must take the form of [hours]:[minutes]:[seconds],[milliseconds]
    parseTimeStamp: function parseTimeStamp(input) {
        var matches = input.match(/^(\d{2}):(\d{2}):(\d{2}),(\d{3})/);

        if (!matches) {
            return null;
        }

        return this.computeSeconds(matches[1], matches[2], matches[3], matches[4]);
    },

    parse: function parse(data) {
        this.buffer = this.buffer + data;
    },

    flush: function flush() {
        var _this = this;

        var rawCues = this.buffer.replace(/\r?\n/gm, '\n').trim().split('\n\n');

        rawCues.each(function (rawCueBlock) {
            var cueLines = rawCueBlock.split('\n');
            var cueid = cueLines.shift();
            var cuetc = cueLines.shift().split(' --> ');
            var cueobj = new SRTCue(_this.parseTimeStamp(cuetc[0]), _this.parseTimeStamp(cuetc[1]), cueLines.join('\n'));

            cueobj.id = cueid;
            _this.oncue.call(_this, cueobj);
        });

        this.onflush.call(this);
    }
});

exports.WebSRT = WebSRT;
exports.SRTCue = SRTCue;

},{"vtt.js":3}]},{},[18])(18)
});
