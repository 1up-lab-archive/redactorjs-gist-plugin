if (typeof RedactorPlugins === 'undefined') var RedactorPlugins = {};

(function(plugins)
{
    "use strict"
    
    plugins.gist = {
        
        init: function()
        {
            var me = this;
            
            this.addBtnAfter('link', 'gist', 'Add Gist', function(obj)
		    {
		        var selection    = me.getSelectedHtml();
		        var hasSelection = selection.length > 0;
		        
		        // will be undefined if not a number or gist url
		        var gistCode = hasSelection ? me.addGistBySelection(selection) : me.addGistByModal();
		        
		        if(typeof gistCode !== 'undefined')
		        {
			        obj.insertHtml(me.getGistTemplate(gistCode));
			    }
			    
			    me.syncCode();
		    });
        },
        
        addGistBySelection: function(selection)
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
        
        addGistByModal: function()
        {
            throw "NotImplementedYet";
        },
        
        getGistTemplate: function(gistCode)
        {
            var url = "https://gist.github.com/" + gistCode + ".js";
            var script = "<p class=\"github-gist\"> \
                <span style=\"display:none\">gist:" + gistCode + "</span> \
                <scr" + "ipt src=\"" + url + "\"></script></p>";
            
            return script;
        }
    };
    
})(RedactorPlugins);
