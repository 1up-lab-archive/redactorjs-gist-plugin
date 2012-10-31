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
