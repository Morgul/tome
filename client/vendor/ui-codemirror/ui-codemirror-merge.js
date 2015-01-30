// ---------------------------------------------------------------------------------------------------------------------
// CodeMirror Merge directive
//
// @module ui-codemirror-merge.js
// ---------------------------------------------------------------------------------------------------------------------

function CodeMirrorMergeFactory()
{
    function CodeMirrorLink(scope, element, attrs, ngModel)
    {
        var cmView = CodeMirror.MergeView(element[0], { value: "", origRight: "" });

        if(ngModel)
        {
            ngModel.$render = function()
            {
                var safeViewValue = ngModel.$viewValue || '';
                cmView.editor().setValue(safeViewValue);

                cmView.editor().refresh();
                cmView.rightOriginal().refresh();
            };
        } // end if

        // -------------------------------------------------------------------------------------------------------------
        // Watches
        // -------------------------------------------------------------------------------------------------------------

        // Watch the options object for changes
        scope.$watch('options', function(newValues)
        {
            for(var key in newValues)
            {
                if(newValues.hasOwnProperty(key))
                {
                    cmView.editor().setOption(key, newValues[key]);
                    cmView.rightOriginal().setOption(key, newValues[key]);
                } // end if
            } // end for

            cmView.editor().refresh();
            cmView.rightOriginal().refresh();
        }, true);

        scope.$watch('ui-refresh', function(newVal, oldVal)
        {
            if(newVal != oldVal)
            {
                cmView.editor().refresh();
                cmView.rightOriginal().refresh();
            } // end if
        });

        scope.$watch('right', function(newVal)
        {
            cmView.rightOriginal().setValue(newVal || '');

            cmView.editor().refresh();
            cmView.rightOriginal().refresh();
        });

        // -------------------------------------------------------------------------------------------------------------
        // Events
        // -------------------------------------------------------------------------------------------------------------

        cmView.editor().on('changes', function(instance)
        {
            var newValue = instance.getValue();
            if(ngModel && newValue !== ngModel.$viewValue)
            {
                ngModel.$setViewValue(newValue);
            } // end if

            if(!scope.$root.$$phase)
            {
                scope.$apply();
            } // end if
        });

        // -------------------------------------------------------------------------------------------------------------
    } // end CodeMirrorLink

    return {
        restrict: 'E',
        require: '?ngModel',
        template: "<div></div>",
        scope: {
            right: '=',
            options: '=',
            'ui-refresh': '='
        },
        link: CodeMirrorLink,
        replace: true
    };
} // end CodeMirrorMergeFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('ui.codemirror').directive('uiCodemirrorMerge', [CodeMirrorMergeFactory]);

// ---------------------------------------------------------------------------------------------------------------------