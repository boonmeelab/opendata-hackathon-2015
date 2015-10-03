define(['jade'], function(jade) { if(jade && jade['runtime'] !== undefined) { jade = jade.runtime; }

this["JST"] = this["JST"] || {};

this["JST"]["src/jade/index"] = function template(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;

var jade_indent = [];
buf.push("<!DOCTYPE html>\n<html>\n  <head>\n    <title>อุบัติเหตุปีใหม่</title>\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <link rel=\"stylesheet\" href=\"/public/css/main.css\">\n    <script data-main=\"/public/js/config.js\" src=\"/public/js/require.js\"></script>\n    <script>\n      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n      \n      ga('create', 'UA-43653558-9', 'auto');\n      ga('send', 'pageview');\n      \n    </script>\n  </head>\n  <body>\n    <h1>อุบัติเหตุปีใหม่</h1>\n    <p>content goes here</p>\n  </body>\n</html>");;return buf.join("");
};

return this["JST"];

});