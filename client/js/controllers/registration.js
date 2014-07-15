// ---------------------------------------------------------------------------------------------------------------------
// A controller for registration pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function RegistrationPageController($scope, $route, $location, $http, Persona)
{
    // We're already logged in, go to the profile page.
    if(Persona.currentUser)
    {
        $location.path('/profile');
    }
    else
    {
        $scope.user = { email: $route.current.params.email };
        $scope.allowed = Persona.registrationAllowed;

        // Only try to do this if we're allowed to register
        if($scope.allowed)
        {
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
                        Persona.login();
                    })
                    .error(function(data, status)
                    {
                        console.error('failed:', data, status);
                    });
            }; // end register
        } // end if
    } // end if
} // end RegistrationPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('RegistrationPageController', ['$scope', '$route', '$location', '$http', 'Persona', RegistrationPageController]);

// ---------------------------------------------------------------------------------------------------------------------