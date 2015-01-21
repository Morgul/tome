// ---------------------------------------------------------------------------------------------------------------------
// Directive for the site header
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function HeaderController($scope, $location, authSvc)
{
    $scope.isCollapsed = true;

    Object.defineProperty($scope, 'user', {
        get: function(){ return authSvc.user; }
    });

    $scope.login = function()
    {
        authSvc.login();
    };

    $scope.logout = function()
    {
        authSvc.logout();
    };

    $scope.search = function()
    {
        $location.path('/search').search('text=' + $scope.query);
        $scope.query = "";
        $scope.isCollapsed = true;
    }; // end search
} // end HeaderController

function TomeHeaderDirective()
{
    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/directives/header/partials/header.html",
        controller: ['$scope', '$location', 'AuthService', HeaderController],
        replace: true
    }
} // end TomeHeaderDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('tomeHeader', TomeHeaderDirective);

// ---------------------------------------------------------------------------------------------------------------------