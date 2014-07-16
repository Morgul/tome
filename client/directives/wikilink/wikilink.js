// ---------------------------------------------------------------------------------------------------------------------
// Directive for wiki links
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function WikiLinkController($scope, wikiPage)
{
    $scope.title = $scope.title == 'null' ? "" : $scope.title;

    $scope.external = $scope.href.indexOf('http') == 0;
    $scope.nonexistant = false;
    $scope.url = $scope.href.indexOf('/') != 0 ? '/wiki/' + $scope.href : $scope.href;

    if(!$scope.external)
    {
        wikiPage.exists($scope.href, function(exists)
        {
            console.log('exists:', exists);
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
        controller: ['$scope', 'wikiPage', WikiLinkController],
        replace: true
    }
} // end WikiLinkDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('wikiLink', WikiLinkDirective);

// ---------------------------------------------------------------------------------------------------------------------