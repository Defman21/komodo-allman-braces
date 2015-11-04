/**
 * @fileoverview  Auto completes curly braces to start on a new line
 * @author        Sergey Kislyakov (Defman21)
 * @version       1.1
 */

if (typeof(extensions) === 'undefined') {
    extensions = {};
}
if (extensions.AllmanBraces && extensions.AllmanBraces.onKeyPress) {
    // Remove the existing trigger handler, we'll re-instate it.
    var editor_pane = ko.views.manager.topView;
    editor_pane.removeEventListener('keypress', extensions.AllmanBraces.onKeyPress, true);
}

extensions.AllmanBraces = {};
(function() {

    var logger = require('ko/logging').getLogger('AllmanBraces');
        editor = require('ko/editor');

    this.onKeyPress = function(e) {
        logger.debug("onKeyPress event: Key: " + e.charCode + " | Shift: " + e.shiftKey);
        if (e.charCode != 123 || !e.shiftKey) return;
        var pos = editor.getCursorPosition("absolute"),
            string = editor.getRange(pos-2, pos);
        logger.debug(string);
        if (string != ") ") return;
        editor.delCharBefore(); // remove a space after the )
        var snippet = {
            hasAttribute: function(name) {
                return name in this;
            },
            getStringAttribute: function(name) {
                return this[name];
            },
            name: "AllmanBraces snippet",
            indent_relative: "true",
            value: "\n[[%soft:{]]\n   [[%tabstop:]]\n[[%soft:}]]"
        };
        // Insert auto-completion
        ko.projects.snippetInsert(snippet);
        e.preventDefault();
    }
    // Bind keypress listener
    var editor_pane = ko.views.manager.topView;
    editor_pane.addEventListener('keypress', this.onKeyPress, true);

}).apply(extensions.AllmanBraces);
