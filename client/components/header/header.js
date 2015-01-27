// ---------------------------------------------------------------------------------------------------------------------
// Directive for the site header
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function HeaderController($scope, $location, authSvc, configSvc)
{
    $scope.loaded = false;
    $scope.isCollapsed = true;

    Object.defineProperties($scope, {
        user: {
            get: function(){ return authSvc.user; }
        },
        clientID: {
            get: function(){
                return configSvc.config.googleClientID;
            }
        }
    });

    // Wait for the config to be loaded before we enable to button
    configSvc.config.$promise
        .then(function()
        {
            $scope.loaded = true;
        });

    // -----------------------------------------------------------------------------------------------------------------
    // Functions
    // -----------------------------------------------------------------------------------------------------------------

    $scope.signOut = function()
    {
        authSvc.signOut();
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
        templateUrl: "/components/header/header.html",
        controller: ['$scope', '$location', 'AuthService', 'ConfigService', HeaderController],
        replace: true
    }
} // end TomeHeaderDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('tomeHeader', TomeHeaderDirective);

// ---------------------------------------------------------------------------------------------------------------------