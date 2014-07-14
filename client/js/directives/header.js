// ---------------------------------------------------------------------------------------------------------------------
// Directive for the site header
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function HeaderController($scope, $location, Persona)
{
    $scope.isCollapsed = true;

    Object.defineProperty($scope, 'user', {
        get: function(){ return Persona.currentUser; }
    });

    $scope.login = function()
    {
        Persona.login();
    };

    $scope.logout = function()
    {
        Persona.logout();
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
        templateUrl: "/partials/header.html",
        controller: ['$scope', '$location', 'Persona', HeaderController],
        replace: true
    }
} // end TomeHeaderDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('tomeHeader', TomeHeaderDirective);

// ---------------------------------------------------------------------------------------------------------------------