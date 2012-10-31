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
    
    plugins.gist = {
        
        init: function()
        {
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
        
        getGistNumber: function(selection)
        {
            if(typeof selection === 'Number' && selection % 1 == 0)
            {
                return selection;
            }
            
            var parser = document.createElement('a');
            parser.href = selection;
            
            if(parser.hostname === "gist.github.com")
            {
                var gistCode = ~~parser.pathname.replace('/', '');
                
                return gistCode > 0 ? gistCode : undefined;
            }
            
            return undefined;
        },
        
        addGistByModal: function(obj)
        {
            var me = this;
            
            var callback = $.proxy(function()
            {
                me.saveSelection();
                $('#gist-modal-url').focus();
                
                $("#redactor_modal #gist-modal-link").click($.proxy(function()
                {
                    var gistCode = me.getGistNumber($('#gist-modal-url').val());
                    
                    if(typeof gistCode !== 'undefined')
                    {
                        me.restoreSelection();
                        obj.insertHtml(me.getGistTemplate(gistCode));   
                    }
                    
                    me.modalClose();
                    
                }, this));
            });
            
            obj.modalInit('To add Gist from Github insert a gist url.', this.getModalTemplate(), 500, callback);
        },
        
        getGistTemplate: function(gistCode)
        {
            var url = "https://gist.github.com/" + gistCode + ".js";
            var script = "<p class=\"github-gist\"> \
                <span style=\"display:none\">gist:" + gistCode + "</span> \
                <scr" + "ipt src=\"" + url + "\"></script></p>";
            
            return script;
        },
        
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
