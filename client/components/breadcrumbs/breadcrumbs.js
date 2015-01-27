// ---------------------------------------------------------------------------------------------------------------------
// A sticky breadcrumbs implementation.
//
// @module breadcrumbs.js
// ---------------------------------------------------------------------------------------------------------------------

function BreadcrumbsController($scope, $location, pageSvc)
{
    Object.defineProperties($scope, {
        pageType: {
            get: function()
            {
                var prefix = $location.path().split('/')[1];

                switch(prefix)
                {
                    case 'wiki':
                        if($location.search().edit)
                        {
                            return 'edit';
                        }
                        else if($location.search().comments)
                        {
                            return 'comments';
                        } // end if

                        return 'wiki';

                    default:
                        return prefix;
                } // end switch
            } // end get
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // Edit page functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.save = function()
    {
        $scope.$root.$broadcast('save');
    }; // end save

    $scope.revert = function()
    {
        $scope.$root.$broadcast('revert');
    }; // end revert

    $scope.delete = function()
    {
        $scope.$root.$broadcast('delete');
    }; // end delete

    //------------------------------------------------------------------------------------------------------------------
    // View page functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.goToEdit = function()
    {
        $location.search({ edit: true });
    }; // end edit

    $scope.goToComments = function()
    {
        $location.search({ comments: true });
    }; // end history

    $scope.goToHistory = function()
    {
        $location.search({ history: true });
    }; // end history

    $scope.addComment = function()
    {
        $scope.$root.$broadcast('comment');
    }; // end history

    //------------------------------------------------------------------------------------------------------------------
    // Breadcrumbs functions
    //------------------------------------------------------------------------------------------------------------------

    $scope.breadcrumbs = function()
    {
        var wikiPath = pageSvc.wikiPath || "";
        var pathElems = wikiPath.split('/');
        if(pathElems.length < 2 && pathElems[0] == "")
        {
            pathElems = $location.path() == '/' ? ["welcome"] : [];
        } // end if

        if($scope.pageType !== 'wiki')
        {
            pathElems.push($scope.pageType);
        } // end if

        return [""].concat(pathElems);
    }; // end breadcrumbs

    $scope.buildCrumbUrl = function($index)
    {
        var wikiPath = pageSvc.wikiPath || "";
        return wikiPath.split('/').slice(0, $index).join('/');
    }; // end buildCrumbUrl
} // end BreadcrumbsController

function StickyBreadcrumbsDirective($document)
{
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/components/breadcrumbs/breadcrumbs.html',
        link: function(scope, elem, attrs)
        {
            scope.fixed = false;

            $document.on('scroll', function(event)
            {
                var child = elem.children()[0];
                elem.css('min-height', child.getBoundingClientRect().height + 'px');

                var elemRect = elem[0].getBoundingClientRect();
                scope.$apply(function()
                {
                    scope.fixed = elemRect.top <= 0;
                });
            });
        },
        controller: ['$scope', '$location', 'PageService', BreadcrumbsController],
        replace: true
    }
}

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('breadcrumbs', ['$document', StickyBreadcrumbsDirective]);

// ---------------------------------------------------------------------------------------------------------------------