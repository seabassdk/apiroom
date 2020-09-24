ace.define(
  "ace/mode/zencode_highlight_rules",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text_highlight_rules",
  ],
  function (require, exports, module) {
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules")
      .TextHighlightRules;
    var ZencodeHighlightRules = function() {

        var token = {
            "given" : "keyword",
            "when" : "constant.language",
            "then" : "variable.languae",
        };

        var regexCheckRule = "rule check version";
		var regexUnknownIgnoreRule = "Rule unknown ignore";
        var regexInputOutputRule = "rule (input|output) \\S+ \\S+";
        var inputOutputRegex = "'\\s*(url64|base64|hex|binary|number|string|array|keypair)\\s*'";

        var scenarios = {"given" :"", "when": "", "then": ""};

        this.$rules = {
            "start" : [ {
                token : "comment",
                regex : "#.*$"
            }, {
                token: "constant.language",
                regex: 'scenario',
                next: "scenario_start"
            }, {
                token: "support.function",
                regex: regexCheckRule
            },{
                token: "support.function",
                regex: regexUnknownIgnoreRule
            }, {
                token: "support.function",
                regex: regexInputOutputRule
            }, {
                token: "constant.numeric",
                regex: '\\d\\.\\d\\.\\d'
            }, {
                include: "scenario",
                caseInsensitive: true
            }],
            "scenario": [{
                token: token["given"],
                regex: "^\\s*given ",
                next: "given"
            }, {
                token: token["when"],
                regex: "^\\s*when ",
                next: "when"
            }, {
                token: token["then"],
                regex: "^\\s*then ",
                next: "then"
            }, {
                caseInsensitive: true
            }],
            "scenario_error": [{
                token: "invalid",
                regex: "given ",
            }, {
                token: "invalid",
                regex: "then ",
            }, {
                token: "invalid",
                regex: "when ",
            }],
            "given": [{
                token: "support.function",
                regex: inputOutputRegex,
            }, {
                token: "string",
                regex: "'",
                next: "given_string"
            }, {
                regex: "^\\s*and +",
                token: token["given"]
            }, {
                defaultToken: token["given"],
                caseInsensitive: true
            }, {
                include: "comment"
            }, {
                token: "string",
                regex: "$",
                next: "given"
            }, {
                include: "scenario"
            }, {
                include: "scenario_error"
            }, {
                token: "none",
                regex: "^.*",
            }],
            "then": [{
                token: "support.function",
                regex: inputOutputRegex,
            }, {
                token: "string",
                regex: "'",
                next: "then_string"
            }, {
                regex: "^\\s*and +",
                token: token["then"]
            }, {
                defaultToken: token["then"],
                caseInsensitive: true
            }, {
                include: "comment"
            }, {
                token: "string",
                regex: "$",
                next: "then"
            }, {
                include: "scenario"
            }, {
                include: "scenario_error"
            }, {
                token: "none",
                regex: "^.*"
            }],
            "when": [{
                token: "support.function",
                regex: inputOutputRegex,
            }, {
                token: "string",
                regex: "'",
                next: "when_string"
            }, {
                regex: "^\\s*and +",
                token: token["when"]
            }, {
                defaultToken: token["when"],
                caseInsensitive: true
            }, {
                include: "comment"
            }, {
                token: "string",
                regex: "$",
                next: "when"
            }, {
                include: "scenario"
            }, {
                include: "scenario_error"
            }, {
                token: "none",
                regex: "^.*"
            }],
            "comment": [{
                token : "comment",
                regex : "\\s*#.*$"
            }],
            "scenario_start" : [{
                token: "string",
                regex: "[A-Za-z]+"
            }, {
                token: "keyword",
                regex: ":",
                next: "scenario_continue"
            }, {
                token: "string",
                regex: "'",
                next: "scenario_string"
            }, {
                include: "comment"
            }],
            "scenario_string" : [{
                token: "string",
                regex: "'",
                next: "scenario_puntuaction"
            }, {
                defaultToken: "string",
            }, {
                include: "comment"
            }],
            "given_string": [{
                token: "string",
                regex: "'",
                next: "given"
            }, {
                defaultToken: "string",
            }],
            "then_string": [{
                token: "string",
                regex: "'",
                next: "then"
            }, {
                defaultToken: "string",
            }],
            "when_string": [{
                token: "string",
                regex: "'",
                next: "when"
            }, {
                defaultToken: "string",
            }],
            "scenario_puntuaction": [{
                token: "keyword",
                regex: ":",
                next: "scenario_continue"
            }, {
                include: "comment"
            }],
            "scenario_continue": [{
                token: "string",
                regex: '( *\\S*)+$',
                next: "start"
            }, {
                include: "comment"
            }]
        };

        this.normalizeRules();
    };

    oop.inherits(ZencodeHighlightRules, TextHighlightRules);

    exports.ZencodeHighlightRules = ZencodeHighlightRules;
    }
);

ace.define(
  "ace/mode/zencode",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/mode/zencode_highlight_rules",
  ],
  function (require, exports, module) {
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var ZencodeHighlightRules = require("./zencode_highlight_rules")
      .ZencodeHighlightRules;

    var Mode = function () {
      this.HighlightRules = ZencodeHighlightRules;
      this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);

    (function () {
      this.lineCommentStart = "#";

      //   this.getNextLineIndent = function (state, line, tab) {
      //     var indent = this.$getIndent(line);

      //     var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
      //     var tokens = tokenizedLine.tokens;

      //     if (tokens.length && tokens[tokens.length - 1].type == "comment") {
      //       return indent;
      //     }

      //     if (state == "start") {
      //       var match = line.match(/^.*[\{\(\[:]\s*$/);
      //       if (match) {
      //         indent += tab;
      //       }
      //     }

      //     return indent;
      //   };

      //   var outdents = {
      //     pass: 1,
      //     return: 1,
      //     raise: 1,
      //     break: 1,
      //     continue: 1,
      //   };

      //   this.checkOutdent = function (state, line, input) {
      //     if (input !== "\r\n" && input !== "\r" && input !== "\n") return false;

      //     var tokens = this.getTokenizer().getLineTokens(line.trim(), state)
      //       .tokens;

      //     if (!tokens) return false;

      //     // ignore trailing comments
      //     do {
      //       var last = tokens.pop();
      //     } while (
      //       last &&
      //       (last.type == "comment" ||
      //         (last.type == "text" && last.value.match(/^\s+$/)))
      //     );

      //     if (!last) return false;

      //     return last.type == "keyword" && outdents[last.value];
      //   };

      //   this.autoOutdent = function (state, doc, row) {
      //     // outdenting in python is slightly different because it always applies
      //     // to the next line and only of a new line is inserted

      //     row += 1;
      //     var indent = this.$getIndent(doc.getLine(row));
      //     var tab = doc.getTabString();
      //     if (indent.slice(-tab.length) == tab)
      //       doc.remove(
      //         new Range(row, indent.length - tab.length, row, indent.length)
      //       );
      //   };

      this.$id = "ace/mode/zencode";
    }.call(Mode.prototype));

    exports.Mode = Mode;
  }
);

(function () {
  ace.require(["ace/mode/zencode"], function (m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();
