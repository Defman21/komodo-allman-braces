/**
 * @fileoverview  Auto completes curly braces to start on a new line
 * @author        Sergey Kislyakov (Defman21)
 * @version       1.0
 */

if (typeof(extensions) === 'undefined') {
    extensions = {};
}
if (extensions.SmartBraces && extensions.SmartBraces.onKeyPress) {
    // Remove the existing trigger handler, we'll re-instate it.
    var editor_pane = ko.views.manager.topView;
    editor_pane.removeEventListener('keypress', extensions.SmartBraces.onKeyPress, true);
}

extensions.SmartBraces = {};

(function() {

    this.onKeyPress = function(e) {
        if (e.charCode != 123 /* { */ || !e.shiftKey) return;
        /**
         * List of supported languages where the marco will work
         */
        const SUPPORTED_LANGS = "php javascript css";
        /**
         * List of languages where the line must be checked for some rules
         * @see check()
         */
        const LANGS_REQUIRE_CHECK = "javascript";

        /**
         * Check if a keywords is in the string
         *
         * @param   {String} string String to check
         *
         * @returns {Boolean} True if is, false if not.
         */
        function check(string)
        {
            const KEYWORDS = ['if', 'else', 'function'];
            for (key of KEYWORDS) {
                if (string.indexOf(key) !== -1) return true;
            }
            return false;
        }

        // Get scimoz API
        var editor = require("ko/editor");

        // Validate our context
        var currentPos = editor.getCursorPosition("absolute"),
            strRight = editor.getRange(currentPos, currentPos + 1),
            isChecked = false,
            isEndOfLine = [0, 10].indexOf(strRight.charCodeAt(0)) !== -1,
            isSupportedLang = SUPPORTED_LANGS.indexOf(editor.getLanguage().toLowerCase()) !== -1;

        if (LANGS_REQUIRE_CHECK.indexOf(editor.getLanguage().toLowerCase()) === -1) {
            isChecked = true;
        } else {
            isChecked = check(editor.getLine());
        }

        if (!isEndOfLine || !isChecked || !isSupportedLang) return;

        var snippet = {
            hasAttribute: function(name) {
                return name in this;
            },
            getStringAttribute: function(name) {
                return this[name];
            },
            name: "SmartBraces snippet",
            indent_relative: "true",
            value: "\n{\n	[[%tabstop:]]\n}"
        };

        // Insert auto-completion
        ko.projects.snippetInsert(snippet);

        // Prevent default auto-completion
        e.preventDefault();
    }

    // Bind keypress listener
    var editor_pane = ko.views.manager.topView;
    editor_pane.addEventListener('keypress', this.onKeyPress, true);

}).apply(extensions.SmartBraces);
