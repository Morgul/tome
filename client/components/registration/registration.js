// ---------------------------------------------------------------------------------------------------------------------
// A controller for registration pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function RegistrationPageController($scope, $route, $location, $http, authSvc, WikiConfig)
{
    // We're already logged in, go to the profile page.
    if(authSvc.user)
    {
        $location.path('/profile');
    }
    else
    {
        $scope.user = { email: $route.current.params.email };
        $scope.allowed = WikiConfig.config.registration === true;

        // Only try to do this if we're allowed to register
        if($scope.allowed)
        {
            $scope.registerSucceeded = false;

            $http.get('/api/human')
                .success(function(data)
                {
                    $scope.human = data;
                    $scope.user.humanIndex = data.index;
                });

            $scope.register = function()
            {
                $http.put('/api/user/' + $scope.user.email, $scope.user)
                    .success(function(data)
                    {
                        $scope.registerSucceeded = true;
                    })
                    .error(function(data, status)
                    {
                        console.error('failed:', data, status);
                    });
            }; // end register

            $scope.login = function()
            {
                authSvc.login();
            };
        } // end if
    } // end if
} // end RegistrationPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('RegistrationPageController',
    ['$scope', '$route', '$location', '$http', 'AuthService', 'WikiConfig', RegistrationPageController]);

// ---------------------------------------------------------------------------------------------------------------------