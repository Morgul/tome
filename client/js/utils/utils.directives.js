// ---------------------------------------------------------------------------------------------------------------------
// Utility directives
//
// @module utils.directives.js
// ---------------------------------------------------------------------------------------------------------------------

function MarkdownDirective($compile, $filter)
{
    return {
        restrict: 'E',
        scope: {
            src: '='
        },
        template: "<div></div>",
        link: function(scope, elem)
        {
            scope.$watch('src', function()
            {
                // Render the markdown text
                var src = $filter('markdown')(scope.src);

                // Add those rendered elements to our element
                elem.html(src);

                // Tell $compile to render our element's new contents
                $compile(elem.contents())(scope);
            });
        },
        replace: true
    }
} // end MarkdownDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.utils').directive('markdown', MarkdownDirective);

// ---------------------------------------------------------------------------------------------------------------------