// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki page history
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function PageCommentsController($scope, $q, $route, $location, $http, $document, $timeout, authSvc, titleSvc)
{
    $scope.newCommentCollapse = true;
    $scope.comment = {};
    $scope.refresh = false;
    $scope.loaded = false;

    $scope.editorOptions = {
        lineWrapping : true,
        mode: 'gfm'
    };

    $scope.order = "-created";
    $scope.orders = [
        {
            text: 'Ascending',
            value: '-created'
        },
        {
            text: 'Descending',
            value: 'created'
        }
    ];

    // Set the page title
    titleSvc.set(function(page)
    {
        return '"' + (page.title || page.url) + '" Comments';
    });

    // Load comments
    $scope.page.loadComments(true);

    Object.defineProperty($scope, 'user', {
        get: function(){  return authSvc.user; }
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------------------------------------------------

    $scope.$on('comment', function()
    {
        $scope.startComment();
    });

    $scope.$on('scrollToComment', function()
    {
        var commentID = $location.search().comment;
        if(commentID)
        {
            $timeout(function()
            {
                $scope.scrollTo(commentID);
            }, 1000);
        } // end if
    });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.scrollToComment = function()
    {
        $scope.$broadcast('scrollToComment');
    }; // end scrollToComment

    $scope.scrollTo = function(elemID)
    {
        var elem = angular.element(document.getElementById(elemID));
        if(elem[0])
        {
            return $document.scrollTo(elem, 0, 200);
        }
        else
        {
            var deferred = $q.defer();
            deferred.reject();
            return deferred.promise;
        } // end if
    }; // end scrollTo

    $scope.startComment = function(title, body, id)
    {
        $scope.comment = { title: title, body: body, id: id};
        $scope.newCommentCollapse = false;
        $timeout(function()
        {
            $scope.scrollTo('new-comment')
                .then(function()
                {
                    $scope.refresh = !$scope.refresh;
                });
        }, 150);
    }; // end startComment

    $scope.finishComment = function()
    {
        $scope.comment.pageID = $scope.page.id;

        if($scope.comment.id)
        {
            $http.put('/comments/' + $scope.comment.id, $scope.comment)
                .success(function()
                {
                    $route.reload();
                });
        }
        else
        {
            $http.post('/comments', $scope.comment)
                .success(function()
                {
                    $route.reload();
                });
        } // end if
    }; // end finishComment

    $scope.delete = function(id)
    {
        $http.delete('/comments/' + id, $scope.comment)
            .success(function()
            {
                $route.reload();
            });
    }; // end delete

    $scope.cancel = function()
    {
        $scope.comment = {};
        $scope.newCommentCollapse = true;
    }; // end cancel
} // end PageCommentsController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('PageCommentsController', [
    '$scope',
    '$q',
    '$route',
    '$location',
    '$http',
    '$document',
    '$timeout',
    'AuthService',
    'TitleService',
    PageCommentsController
]);

// ---------------------------------------------------------------------------------------------------------------------

