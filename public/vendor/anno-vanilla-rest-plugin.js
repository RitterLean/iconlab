/**
 * A basic plugin to store annotations on a REST-style HTTP/JSON endpoint.
 */

annotorious.plugin.VanillaREST = (function () {
    'use strict';

    function VanillaREST(options) {

        /** @private **/
        this._annotations = [];

        /** @private **/
        this._loadIndicators = [];


        this.options = {
            extraAnnotationData: {},
            loadFromSearch: false,
            prefix: '/store',
            urls: {
                create: '/annotation',
                read: '/annotations',
                update: '/annotation/:id',
                destroy: '/annotation/:id',
                search: '/annotations/search?query=*&limit=1000'
            }
        };

        this.options = jQuery.extend(this.options, options);
    };


    VanillaREST.prototype.initPlugin = function (anno) {
        var self = this;
        anno.addHandler('onAnnotationCreated', function (annotation) {
            self._create(annotation);
        });

        anno.addHandler('onAnnotationUpdated', function (annotation) {
            self._update(annotation);
        });

        anno.addHandler('onAnnotationRemoved', function (annotation) {
            self._delete(annotation);
        });

    };

    VanillaREST.prototype.onInitAnnotator = function (annotator) {
        var spinner = this._newLoadIndicator();
        annotator.element.appendChild(spinner);
        this._loadIndicators.push(spinner);
        this._loadAnnotations(anno);
        
    };


    /**
     * @private
     */
    VanillaREST.prototype._loadAnnotations = function (anno) {
        var self = this;
        //console.log(self);
        var url = '';
        url = this._getActionUrl('read', null);
        //console.log(url);
        var annotation = {};
        jQuery.getJSON(url, function (data) {
            annotation = data;

            for (var index = 0; index < annotation.length; index++) {
                console.log(annotation[index]);
                anno.addAnnotation(annotation[index]);
                
            }
            
            //anno.addAnnotation(annotation);
        });
        // jQuery.ajax({
        //         url: this._getActionUrl('read', null),
        //         type: 'GET',
        //         data: this._getAnnotationData(annotation),
        //         contentType: 'application/json; charset=utf-8'
        //     })

        //     .fail(function (jqXHR) {
        //         self._onResponseError(jqXHR, 'create');
        //     });

        //     var url = '';
        //     if (this.options.loadFromSearch === false) {
        //         //console.log("READ")
        //         url = this._getActionUrl('read', null);
        //         //console.log(url);
        //     } else {
        //         console.log("Search")
        //         url = this._getActionUrl('search', null);
        //     }
        //     jQuery.getJSON(url, function (data) {
        //         try {

        //             jQuery.each(data, function (index, data) {
        //                 var annotation = {};


        //                 //console.log(data);
        //                 //--------------------------------------------------------DO I NEED SOURCE AND ID?
        //                 if (typeof data.file != 'undefined' && typeof data._id != 'undefined') {
        //                     // annotation = data['source'];
        //                     annotation = data.imageAnnotation;
        //                     // console.log(annotation)
        //                     annotation.id = data.imageAnnotation._id;
        //                     // console.log(annotation.id);

        //                 } else if (data !== null) {
        //                     // console.log("hurensohn");
        //                     annotation = data;
        //                 } else {
        //                     return;
        //                 }
        //                 // console.log("yeagh");
        //                 // check for required properties
        //                 var reqProp = ['src', 'text', 'shapes', 'context'];
        //                 for (var rp in reqProp) {
        //                     if (reqProp.hasOwnProperty(rp) && !annotation.hasOwnProperty(reqProp[rp])) {
        //                         return;
        //                     }
        //                 }

        //                 console.log(annotation);
        //                 anno.addAnnotation(annotation);
        //                 // console.log("Loaded");

        //                 if (jQuery.inArray(annotation.id, self._annotations) < 0) {
        //                     self._annotations.push(annotation.id);
        //                     console.log(self._annotations);
        //                     // if (!annotation.shape && annotation.shapes[0].geometry) {
        //                         anno.addAnnotation(annotation);
        //                     // }
        //                 }
        //             });
        //         } catch (e) {
        //             console.log(e);
        //             //self._showError(e);
        //         }

        //         // Remove all load indicators
        //         jQuery.each(self._loadIndicators, function (idx, spinner) {
        //             jQuery(spinner).remove();
        //         });
        //     }).fail(function (jqXHR) {
        //         self._onResponseError(jqXHR, 'load');
        //     });
    };


    /**
     * @private
     */
    VanillaREST.prototype._create = function (annotation) {
        var self = this;
        jQuery.ajax({
                url: this._getActionUrl('create', null),
                type: 'POST',
                data: this._getAnnotationData(annotation),
                contentType: 'application/json; charset=utf-8'
            })
            .fail(function (jqXHR) {
                self._onResponseError(jqXHR, 'create');
            });

    };


    /**
     * @private
     */
    VanillaREST.prototype._update = function (annotation) {
        // console.log(annotation);
        //console.log(this._getAnnotationData(annotation));
        var self = this;
        jQuery.ajax({
            url: this._getActionUrl('update', annotation._id),
            type: 'PUT',
            data: this._getAnnotationData(annotation),
            contentType: 'application/json; charset=utf-8'
        }).fail(function (jqXHR) {
            self._onResponseError(jqXHR, 'update');
        });
    };

    /**
     * @private
     */
    VanillaREST.prototype._delete = function (annotation) {
        var self = this;        
        jQuery.ajax({
            url: this._getActionUrl('destroy', annotation._id),
            type: 'DELETE',
            data: this._getAnnotationData(annotation),
            contentType: 'application/json; charset=utf-8'            
        }).fail(function (jqXHR) {
            self._onResponseError(jqXHR, 'delete');
        });
    };


    /**
     * @private
     */
    VanillaREST.prototype._newLoadIndicator = function () {
        var outerDIV = document.createElement('div');
        outerDIV.className = 'annotorious-rest-plugin-load-outer';

        var innerDIV = document.createElement('div');
        innerDIV.className = 'annotorious-rest-plugin-load-inner';

        outerDIV.appendChild(innerDIV);
        return outerDIV;
    };

    /**
     * Get url for given action
     * @private
     * @param {string} action
     * @param {string} _id
     * @returns {string} returns url for given action
     */
    VanillaREST.prototype._getActionUrl = function (action, _id) {
        var url;
        url = this.options.prefix !== null ? this.options.prefix : '';
        url += this.options.urls[action];
        url = url.replace(/\/:id/, _id !== null ? '/' + _id : '');
        url = url.replace(/:id/, _id !== null ? _id : '');
        return url;
    };

    VanillaREST.prototype._getAnnotationData = function (annotation) {
        var data;
        console.log(this);
        jQuery.extend(annotation, this.options.extraAnnotationData);
        data = JSON.stringify(annotation);
        return data;
    };

    VanillaREST.prototype._onResponseError = function (jqXHR, action) {
        var message = "Sorry we could not " + action + " this annotation";
        if (action === 'search') {
            message = "Sorry we could not search the store for annotations";
        } else if (action === 'read') {
            message = "Sorry we could not " + action + " the annotations from the store";
        }
        switch (jqXHR.status) {
            case 401:
                message = "Sorry you are not allowed to " + action + " this annotation";
                break;
            case 404:
                message = "Sorry we could not connect to the annotations store";
                break;
            case 500:
                message = "Sorry something went wrong with the annotation store";
        }
        this.showNotification(message, 'error');
        return console.error("API request failed: '" + jqXHR.status + "'");
    };


    VanillaREST.prototype.showNotification = function (message, type) {
        // TODO prettier notification message
        // TODO fire event onShowNotification so that translator plugin can take care of translating the message first.
        window.alert(message);
        console.log(message);
    };



    return VanillaREST;
}());