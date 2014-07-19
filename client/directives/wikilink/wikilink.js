// ---------------------------------------------------------------------------------------------------------------------
// Directive for wiki links
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiLinkController($scope, $http, wikiPage)
{
    $scope.title = $scope.title == 'null' ? "" : $scope.title;

    $scope.external = $scope.href.indexOf('http') == 0;
    $scope.nonexistant = false;
    $scope.url = ($scope.href.indexOf('/') != 0 && !$scope.external) ? '/wiki/' + $scope.href : $scope.href;

    if(!$scope.external)
    {
        wikiPage.exists($scope.href, function(exists)
        {
            // Handle internal wiki pages
            if(!exists)
            {
                $http.get($scope.href)
                    .error(function()
                    {
                        $scope.nonexistant = true;
                    });
            } // end if
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
        controller: ['$scope', '$http', 'wikiPage', WikiLinkController],
        replace: true
    }
} // end WikiLinkDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('wikiLink', WikiLinkDirective);

// ---------------------------------------------------------------------------------------------------------------------