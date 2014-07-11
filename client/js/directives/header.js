// ---------------------------------------------------------------------------------------------------------------------
// Directive for the site header
//
// @module header.js
// ---------------------------------------------------------------------------------------------------------------------

function HeaderController()
{
} // end HeaderController

function TomeHeaderDirective()
{
    return {
        restrict: 'E',
        scope: true,
        templateUrl: "/partials/header.html",
        controller: HeaderController,
        replace: true
    }
} // end TomeHeaderDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.directives').directive('tomeHeader', TomeHeaderDirective);

// ---------------------------------------------------------------------------------------------------------------------