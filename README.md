Gist plugin for Redactor WYSIWYG-Editor
===

This is a Redactor plugin which introduces a new button in the interface for adding Github Gists.
![Gist Plugin Screenshot](http://i.imgur.com/4JGsd.png)

Activate Plugin
---
Simply follow the instructions on the [official documentation](http://imperavi.com/redactor/docs/creatingplugins/) or take a look at the following minimal example.

```html
<!DOCTYPE html>
<html>
<head>	
    <title>Redactor Gist plugin is awesome!</title>
    <meta charset="utf-8">
	
    <link rel="stylesheet" href="http://imperavi.com/js/redactor/redactor.css" />
    <link rel="stylesheet" href="https://raw.github.com/1up-lab/redactorjs-gist-plugin/master/gist.css" />
	
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
    <script src="http://imperavi.com/js/redactor/redactor.js"></script>    
    <script src="https://raw.github.com/1up-lab/redactorjs-gist-plugin/master/gist.js"></script>

    <script type="text/javascript">
    $(document).ready(function()
    {
        $('#redactor').redactor(
        { 
            plugins: ['gist']
        });	
    });
    </script>
</head>
<body>
    <div id="page">
        <textarea id="redactor" name="content"></textarea>
    </div>
</body>	
</html>
```

That's all! No additional assets like images needed. They are integrated inline in the CSS file.

Known Flaws
---
* When pasting a Gist-URL to the editor and forget to unlink the element, the gist itself will be clickable, because the surrounding link is not removed. If you have an idea how to work around this flaw, drop me line!
* Templating could be nicer. Working with DOM-Elements instead of string-values for example.

Thanks!
---
You're welcome.

---
[Jim Schmid](https://github.com/sheeep) for [1up.io](http://1up.io)
