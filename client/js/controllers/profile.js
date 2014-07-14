// ---------------------------------------------------------------------------------------------------------------------
// A controller for profile pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function ProfilePageController($scope, $http, Persona)
{
    Object.defineProperty($scope, 'user', {
        get: function(){ return Persona.currentUser; },
        set: function(val){ Persona.currentUser = val; }
    });

    $scope.save = function()
    {
        console.log('user:', $scope.user);

        $http.put('/api/user/' + Persona.currentUser.email, $scope.user)
            .success(function(data)
            {
                //TODO: Do something here?
            })
            .error(function(data, status)
            {
                console.error('failed:', data, status);
            });
    }; // end if
} // end ProfilePageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('ProfilePageController', ['$scope', '$http', 'Persona', ProfilePageController]);

// ---------------------------------------------------------------------------------------------------------------------