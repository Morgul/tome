// ---------------------------------------------------------------------------------------------------------------------
// PageResource - An object that wraps up rest calls to the page.
//
// @module page_resource.js
// ---------------------------------------------------------------------------------------------------------------------

function PageResourceFactory($resource, $http, _)
{
    var Page = $resource('/wiki/:slug', {}, {
        history: {
            method: 'GET',
            params: { history: true },
            isArray: true,
            transformResponse: function(data)
            {
                var histories = angular.fromJson(data);
                return _.reduce(histories, function(results, history)
                {
                    history.created = new Date(history.created);
                    results.push(history);
                    return results;
                }, []);
            }
        },
        comments: {
            method: 'GET',
            params: { comments: true },
            isArray: true,
            transformResponse: function(data)
            {
                var comments = angular.fromJson(data);
                return _.reduce(comments, function(results, comment)
                {
                    comment.created = new Date(comment.created);
                    comment.updated = new Date(comment.updated);
                    results.push(comment);
                    return results;
                }, []);
            }
        },
        commentsGroup: {
            method: 'GET',
            params: { comments: true, group: true },
            transformResponse: function(data)
            {
                var groups = angular.fromJson(data);
                return _.transform(groups, function(results, comments, group)
                {
                    results[group] = _.reduce(comments, function(results, comment)
                    {
                        comment.created = new Date(comment.created);
                        comment.updated = new Date(comment.updated);
                        results.push(comment);
                        return results;
                    }, []);

                    return results;
                }, {});
            }
        },
        save: {
            method: 'PUT',
            transformRequest: function(data)
            {
                var page = {
                    title: data.revision.title,
                    tags: data.revision.tags,
                    body: data.revision.body,
                    message: data.revision.message,
                    prevRev: data.revision.id
                };

                return angular.toJson(page);
            }
        }
    });

    function PageResource(url, revision)
    {
        this.url = url;
        this.loaded = false;
        this.$revision = revision;

        this.refresh();
    } // end PageResource

    PageResource.prototype = {
        get id(){ return (this.$resource || {}).id; },
        set id(val){ (this.$resource || {}).id = val; },
        get title(){ return (this.$resource.revision || {}).title; },
        set title(val){ (this.$resource.revision || {}).title = val; },
        get tags(){ return (this.$resource.revision || {}).tags; },
        set tags(val){ (this.$resource.revision || {}).tags = val; },
        get body(){ return (this.$resource.revision || {}).body; },
        set body(val){ (this.$resource.revision || {}).body = val; },
        get message(){ return (this.$resource.revision || {}).message; },
        set message(val){ (this.$resource.revision || {}).message = val; },

        get revision(){ return (this.$resource.revision || {}); },
        get created(){ return (this.$resource || {}).created; },
        get updated(){ return (this.$resource.revision || {}).created; },
        get moved(){ return (this.$resource.revision || {}).moved; },
        get deleted(){ return (this.$resource.revision || {}).deleted; },
        get resolved(){ return this.$resource.$resolved; },
        get promise(){ return this.$resource.$promise; }
    };

    PageResource.prototype.$loadResource = function(options)
    {
        var self = this;
        options = options || {};
        options.slug = this.url;
        options.revision = this.$revision;

        this.$resource = Page.get(options, function(){ self.error = undefined; }, function(response)
        {
            self.$resource = {
                revision: {},
                $resolved: true,
                $save: function(options)
                {
                    // Re-implement save.
                    return $http.put('/wiki/' + options.slug, self.$resource.revision)
                        .success(function()
                        {
                            self.refresh();
                        });
                }
            };
            self.error = response;

            if(self.error.status != 404)
            {
                console.error("Failed to load page.", self.error.data);
            } // end if
        });
    }; // end _loadResources

    PageResource.prototype.refresh = function()
    {
        this.$loadResource()
    }; // end refresh

    PageResource.prototype.loadComments = function(group)
    {
        this.comments = group ? Page.commentsGroup({ slug: this.url }) : Page.comments({ slug: this.url });

        return this.comments.$promise;
    }; // end loadComments

    PageResource.prototype.loadHistory = function()
    {
        this.history = Page.history({ slug: this.url });

        return this.history.$promise;
    }; // end loadComments

    PageResource.prototype.revert = function(revision)
    {
        var self = this;
        return $http.put('/wiki/' + this.url + '?revert=true', { revision: revision })
            .success(function(data)
            {
                self.$resource.revision = data.revision;
                self.$resource.revisionID = revision;
            });
    }; // end revert

    PageResource.prototype.save = function()
    {
        return this.$resource.$save({ slug: this.url }, function(){}, function(response)
        {
            if(response.status == 409)
            {
                console.log('conflict!');
            } // end if
        });
    }; // end save

    PageResource.prototype.delete = function()
    {
        return this.$resource.$delete({ slug: this.url });
    }; // end delete

    return function(url, revision){ return new PageResource(url, revision) };
} // end PageResourceFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('tome').factory('PageResource', [
    '$resource',
    '$http',
    'lodash',
    PageResourceFactory
]);

// ---------------------------------------------------------------------------------------------------------------------