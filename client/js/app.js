// ---------------------------------------------------------------------------------------------------------------------
// Main Tome application.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',

        'tome.controllers',
        'tome.directives',
        'tome.utils'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/', {templateUrl: '/partials/page.html',   controller: 'WikiPageController'})
            .when('/wiki/:wikiPath*', {templateUrl: '/partials/page.html',   controller: 'WikiPageController'})
            .otherwise({redirectTo: '/'});
    }])
    .run(['$route', function($route)
    {
        //--------------------------------------------------------------------------------------------------------------
        // Configure the marked markdown parser
        //--------------------------------------------------------------------------------------------------------------

        var renderer = new marked.Renderer();

        /*
         renderer.heading = function (text, level) {
         var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

         return '<h' + level + '><a name="' +
         escapedText +
         '" class="anchor" href="#' +
         escapedText +
         '"><i class="fa fa-paragraph header-link"></i></a>' +
         text + '</h' + level + '>';
         };
         */

        renderer.link = function(href, title, text)
        {
            if(href.indexOf('http') != 0)
            {
                 if(href.indexOf('/') != 0)
                 {
                     href = '/wiki/' + ($route.current.params.wikiPath ? $route.current.params.wikiPath + '/' : "") + href;
                 } // end if

                return '<a href="' + href + '"' + (title ? ' title="' + title + '"' : "") + '>' + text + '</a>';
            }
            else
            {
                return '<a class="external" href="' + href + '"' + (title ? ' title="' + title + '"' : "") + '>' + text + '</a>';
            } // end if
        }; // end link parsing

        // Configure marked parser
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            renderer: renderer,
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        });

        //--------------------------------------------------------------------------------------------------------------
    }]);

// ---------------------------------------------------------------------------------------------------------------------
// Application Modules
// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers', []);
angular.module('tome.directives', []);
angular.module('tome.utils', []);

// ---------------------------------------------------------------------------------------------------------------------