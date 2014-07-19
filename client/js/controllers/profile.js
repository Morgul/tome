// ---------------------------------------------------------------------------------------------------------------------
// A controller for profile pages
//
// @module page.js
// ---------------------------------------------------------------------------------------------------------------------

function ProfilePageController($scope, $http, $route, $location, Persona)
{
    $scope.email = $route.current.params.email;

    // Support `/profile` as a redirect to your profile, when signed in.
    if(!$scope.email && Persona.currentUser)
    {
        $location.path('/profile/' + Persona.currentUser.email)
    } // end if

    if($scope.email == (Persona.currentUser || {}).email)
    {
        $scope.editing = true;
        $scope.user = Persona.currentUser;
    }
    else
    {
        $http.get('/api/user/' + $scope.email)
            .success(function(user)
            {
                $scope.user = user;
            });
    } // end if

    $scope.save = function()
    {
        console.log('user:', $scope.user);

        $http.post('/api/user/' + Persona.currentUser.email, $scope.user)
            .success(function(data)
            {
                //TODO: Do something here?
            })
            .error(function(data, status)
            {
                console.error('failed:', data, status);
            });
    }; // end save
} // end ProfilePageController

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.controllers').controller('ProfilePageController', ['$scope', '$http', '$route', '$location', 'Persona', ProfilePageController]);

// ---------------------------------------------------------------------------------------------------------------------