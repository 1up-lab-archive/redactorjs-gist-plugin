/**
 * Copyright (C) 2012, Jim Schmid <js@1up.io>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

(function(plugins, $)
{
    "use strict"
    
    // this is our plugin object named gist in the
    // RedactorPlugins namespace
    plugins.gist = {
        
        // this is the initializer of this plugin
        // it will automatically be called after
        // RedactorJS has finished loading its core
        init: function()
        {
            // save a reference to this very object
            // so we can use it later in our callback
            var me = this;
            
            this.addBtnAfter('link', 'gist', 'Add Gist', function(obj)
            {
                var selection = me.getSelectedHtml();
                var hasSelection = selection.length > 0;

                // will be undefined if not a number or gist url
                var gistCode = hasSelection ? me.getGistNumber(selection) : me.addGistByModal(obj);

                if(typeof gistCode !== 'undefined')
                {
                    obj.insertHtml(me.getGistTemplate(gistCode));
                }
            });
        },
        
        // extract the gist number out of a selection string
        // this can either be a valid github url with the hostname
        // being exactly "gist.github.com" or just a numerical
        // id. there is no further test if a given id is a valid
        // gist file. as long as you provide something that could
        // be correct, it will parse it like it is.
        getGistNumber: function(selection)
        {
            // check if the selection string is already
            // a valid number. in that case return it right away
            // as we can assume that we have a correct gist id
            if(typeof selection === 'Number' && selection % 1 == 0)
            {
                return selection;
            }
            
            // thanks to gist, I found a way to parse a url
            // without having to use extensive regex matching
            // thx jlong! https://gist.github.com/2428561
            var parser = document.createElement('a');
            parser.href = selection;
            
            // proceed if hostname matches
            // otherwise it is not a valid gist url
            if(parser.hostname === "gist.github.com")
            {
                // replace all slashes with nothing and parse to
                // integer by two bitwise not operations
                // a very hipster way!
                var gistCode = ~~parser.pathname.replace('/', '');
                
                return gistCode > 0 ? gistCode : undefined;
            }
            
            // if this function wasn't really helpful
            // return undefined so we can check on that
            // later on
            return undefined;
        },
        
        // if the button in the menu of RedactorJS has been
        // clicked without a selection in the text, show
        // a modal window with an input field, where the 
        // user can provide a gist url
        addGistByModal: function(obj)
        {
            var me = this;
            
            // initialize a callback function which will
            // be fired after the modal window has been
            // loaded
            var callback = $.proxy(function()
            {
                // we have to save our current cursor
                // position, due to the fact that we
                // have to insert our resulting script
                // object at this very position
                me.saveSelection();
                
                // autofocus the url field in the modal
                // window. without that a user could write
                // on in the textarea of the editor, after
                // opening the modal
                $('#gist-modal-url').focus();
                
                $("#redactor_modal #gist-modal-link").click($.proxy(function()
                {
                    var gistCode = me.getGistNumber($('#gist-modal-url').val());
                    
                    if(typeof gistCode !== 'undefined')
                    {
                        // restore the previous saved cursor
                        // position to the editor, so we know
                        // where we have to insert the gist
                        // template.
                        me.restoreSelection();
                        obj.insertHtml(me.getGistTemplate(gistCode));
                        
                        // bitchy you.
                        me.syncCode();
                    }
                    
                    // close the modal window after clicking "insert"
                    // and parsing of the url
                    me.modalClose();
                    
                }, this));
            });
            
            obj.modalInit('To add Gist from Github insert a gist url.', this.getModalTemplate(), 500, callback);
        },
        
        // provide a numerical gist id and assemble a string
        // representation of a dom-element to insert into editor
        // window afterwards.
        // it consists of two parts. the first one is a <span /> element
        // which is the representation of the gist in the editor (as it
        // won't show up there).
        // the second one is the script with the gist url
        getGistTemplate: function(gistCode)
        {
            var url = "https://gist.github.com/" + gistCode + ".js";
            var script = "<p class=\"github-gist\"> \
                <span style=\"display:none\">gist:" + gistCode + "</span> \
                <scr" + "ipt src=\"" + url + "\"></script></p>";
            
            return script;
        },
        
        // returns the modal window content, including an input
        // field and little button. nothing fancy here.
        getModalTemplate: function()
        {
            var tmpl = "<div id=\"gist-modal\">\
                <div id=\"redactor_modal_content\">\
                    <p>\
                        <input type=\"text\" id=\"gist-modal-url\"/>\
                        <button class=\"redactor_modal_btn\" id=\"gist-modal-link\">Insert</button>\
                    </p>\
                </div>";
            
            return tmpl;
        }
    };
    
})(RedactorPlugins, jQuery);
