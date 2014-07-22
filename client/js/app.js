// ---------------------------------------------------------------------------------------------------------------------
// Main Tome application.
//
// @module app.js
// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome', [
        'ngRoute',
        'ngResource',
        'ui.bootstrap',
        'ui.gravatar',
        'ui.ngTags',
        'ui.codemirror',
        'duScroll',

        'tome.services',
        'tome.controllers',
        'tome.directives',
        'tome.utils'
    ])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider)
    {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when('/registration', {templateUrl: '/partials/registration.html',   controller: 'RegistrationPageController'})
            .when('/search', {templateUrl: '/partials/search.html',   controller: 'SearchPageController'})
            .when('/recent', {templateUrl: '/partials/recent.html',   controller: 'RecentPageController'})
            .when('/diff/:rev1/:rev2', {templateUrl: '/partials/diff.html',   controller: 'DiffController'})
            .when('/tags/:tag?', {templateUrl: '/partials/tags.html',   controller: 'TagsPageController'})
            .when('/profile/:email?', {templateUrl: '/partials/profile.html',   controller: 'ProfilePageController'})
            .when('/edit/:wikiPath*', {templateUrl: '/partials/edit.html',   controller: 'EditPageController'})
            .when('/comments/:wikiPath*', {templateUrl: '/partials/comments.html',   controller: 'PageCommentsController'})
            .when('/history/:wikiPath*', {templateUrl: '/partials/history.html',   controller: 'PageHistoryController'})
            .when('/wiki/:wikiPath*', {templateUrl: '/partials/page.html',   controller: 'WikiPageController'})
            .otherwise({redirectTo: '/wiki/welcome'});
    }])
    .config(['gravatarServiceProvider', function(gravatarServiceProvider)
    {
        gravatarServiceProvider.defaults = {
            size     : 80,
            "default": 'identicon'  // Mystery man as default for missing avatars
        };

        // Use https endpoint
        gravatarServiceProvider.secure = true;
    }])
    .run(['$rootScope', '$route', 'WikiConfig', 'Persona', function($rootScope, $route, WikiConfig, Persona)
    {
        Object.defineProperty($rootScope, 'version',
            {
                get: function(){ return WikiConfig.config.version; }
            });

        $rootScope.isAuthenticated = function()
        {
            return !!Persona.currentUser;
        }; // end isAuthenticated

        //--------------------------------------------------------------------------------------------------------------
        // Mobile Detection
        //--------------------------------------------------------------------------------------------------------------

        $rootScope.isMobile = function()
        {
            var check = false;
            // From http://stackoverflow.com/questions/11381673/javascript-solution-to-detect-mobile-browser
            (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
            return check;
        };

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

        renderer.table = function(header, body)
        {
            return '<div class="table-responsive"><table class="table table-striped table-hover table-bordered"><thead>' + header + '</thead><tbody>' + body + '</tbody></table></div>';
        };

        renderer.link = function(href, title, text)
        {
            var link = '<wiki-link url="\'' + href + '\'"';
            link += title ? ' hover="\'' + title + '\'"' : '';
            link += ' text="\'' + text + '\'"></wiki-link>';

            return link;
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
angular.module('tome.services', []);
angular.module('tome.directives', []);
angular.module('tome.utils', []);

// ---------------------------------------------------------------------------------------------------------------------