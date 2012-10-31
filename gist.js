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
		        
			    //obj.insertHtml('gist!');
		    });
        },
        
        addGistBySelection: function(selection)
        {
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
            console.log("by modal");
        },
        
        getGistTemplate: function(gistCode)
        {
            
        }
    };
    
})(RedactorPlugins);
