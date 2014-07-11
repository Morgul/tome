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

function EnterDirective()
{
    return function(scope, element, attrs)
    {
        element.bind("keydown keypress", function(event)
        {
            if(event.which === 13)
            {
                scope.$apply(function()
                {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            } // end if
        });
    };
} // end EnterDirective

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome.utils').directive('markdown', MarkdownDirective);
angular.module('tome.utils').directive('ngEnter', EnterDirective);

// ---------------------------------------------------------------------------------------------------------------------