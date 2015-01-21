// ---------------------------------------------------------------------------------------------------------------------
// A controller for wiki page history
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function PageCommentsController($scope, $route, $http, $document, $timeout, wikiPage, authSvc)
{
    $scope.wikiPath = wikiPage.wikiPath;
    $scope.user = authSvc.user;
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

    wikiPage.get($scope.wikiPath).$promise.then(function(page)
    {
        $scope.page = page;
        $scope.$root.title = $scope.page.title + ' Comments';
    }).then(function()
    {
        $http.get('/api/comment?group=true&page=' + $scope.page.page_id).success(function(comments)
        {
            $scope.loaded = true;
            $scope.comments = comments;
        });
    });

    // -----------------------------------------------------------------------------------------------------------------

    $scope.$on('comment', function()
    {
        $scope.startComment();
    });

    $scope.startComment = function(title, body, id)
    {
        $scope.comment = { title: title, body: body, id: id};
        $scope.newCommentCollapse = false;
        $timeout(function()
        {
            var newCommentElem = angular.element(document.getElementById('new-comment'));
            $document.scrollTo(newCommentElem, 0, 200)
                .then(function()
                {
                    $scope.refresh = !$scope.refresh;
                });
        }, 150);
    }; // end startComment

    $scope.finishComment = function()
    {
        $scope.comment.page = $scope.page.page_id;
        if($scope.comment.id)
        {
            $http.put('/api/comment/' + $scope.comment.id, $scope.comment)
                .success(function()
                {
                    $route.reload();
                });
        }
        else
        {
            $http.put('/api/comment', $scope.comment)
                .success(function()
                {
                    $route.reload();
                });
        } // end if
    }; // end finishComment

    $scope.delete = function(id)
    {
        $http.delete('/api/comment/' + id, $scope.comment)
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

angular.module('tome.controllers').controller('PageCommentsController', ['$scope', '$route', '$http', '$document', '$timeout', 'wikiPage', 'AuthService', PageCommentsController]);

// ---------------------------------------------------------------------------------------------------------------------

