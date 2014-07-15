// ---------------------------------------------------------------------------------------------------------------------
// A controller for registration pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function RegistrationPageController($scope, $route, $http, Persona)
{
    $scope.user = { email: $route.current.params.email };

    $http.get('/api/human')
        .success(function(data)
        {
            $scope.human = data;
            $scope.user.humanIndex = data.index;
        });

    $scope.register = function()
    {
        console.log('user:', $scope.user);

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
} // end RegistrationPageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('RegistrationPageController', ['$scope', '$route', '$http', 'Persona', RegistrationPageController]);

// ---------------------------------------------------------------------------------------------------------------------