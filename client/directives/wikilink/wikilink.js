// ---------------------------------------------------------------------------------------------------------------------
// Directive for wiki links
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiLinkController($scope, $route, wikiPage)
{
    $scope.title = $scope.title == 'null' ? "" : $scope.title;

    $scope.external = $scope.href.indexOf('http') == 0;
    $scope.nonexistant = false;
    $scope.url = ($scope.href.indexOf('/') != 0 && !$scope.external) ? '/wiki/' + $scope.href : $scope.href;

    var routeKeys = Object.keys($route.routes);

    // Handle internal pages
    for(var idx = 0; idx < routeKeys.length; idx++)
    {
        var routeKey = routeKeys[idx];
        var route = $route.routes[routeKey];

        if(route.regexp && route.regexp.test($scope.href) && routeKey.indexOf('/wiki') == -1)
        {
            // We know we exist, because we're linking to one of our internal pages.
            return;
        } // end if
    } // end for

    if(!$scope.external)
    {
        wikiPage.exists($scope.href, function(exists)
        {
            $scope.nonexistant = !exists;
        });
    } // end if
} // end WikiLinkController

function WikiLinkDirective()
{
    return {
        restrict: 'E',
        scope: {
            href: "=url",
            title: "=hover",
            text: "="
        },
        templateUrl: "/directives/wikilink/partials/wikilink.html",
        link: function(scope, elem, attr)
        {
            if(scope.title)
            {
                elem.attr('title', scope.title);
            } // end if
        },
        controller: ['$scope', '$route', 'wikiPage', WikiLinkController],
        replace: true
    }
} // end WikiLinkDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('wikiLink', WikiLinkDirective);

// ---------------------------------------------------------------------------------------------------------------------