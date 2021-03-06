var app = angular.module('fileUpload', [
    'ngFileUpload',
    'ngResource',
    'ngRoute',
    'uuid4',
    'ngTagsInput',
    'annotorious',
    'jtt_bricklayer',
    'ui.bootstrap'
]).directive('search', function () {
    return function ($scope, element) {
        element.bind("keyup", function (event) {
            var val = element.val();
            if (val.length > 2) {
                $scope.search(val);
            }
        });
    };
});
var tempFileName, tempID, sessionIdentifier, sessionName, searchQuery;
var init = true;





app.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');

    $routeProvider.
    when('/', {
        templateUrl: '../views/home.html'
    }).
    when('/about', {
        templateUrl: '../views/about.html'
    }).
    when('/hit', {
        templateUrl: '../views/home.html'
    }).
    when('/viewAll', {
        templateUrl: '../views/viewAll.html'
    }).
    when('/viewSessions', {
        templateUrl: '../views/viewAllPartner.html'
    }).
    when('/topics', {
        templateUrl: '../views/viewTopics.html'
    }).
    when('/UploadForm', {
        templateUrl: '../views/01FormUpload.html'
    }).
    when('/formImageInfo/', {
        templateUrl: '../views/02FormImageInfo.html'
    }).
    when('/formImageDes/', {
        templateUrl: '../views/03FormImageDes.html'
    }).
    when('/formImageDesLocation/', {
        templateUrl: '../views/03FormImageDes.location.html'
    }).
    when('/formPRelation', {
        templateUrl: '../views/04FormPRelation.html'
    }).
    when('/formPRelationSub/', {
        templateUrl: '../views/04FormPRelation.Sub.html'
    }).
    when('/uploads/update/:uuid/:filename', {
        templateUrl: '../views/updateForm.html'
    }).
    when('/uploads/collection/:author/:id', {
        templateUrl: '../views/viewAuthor.html'
    }).
    when('/uploads/image/:uuid/:filename', {
        templateUrl: '../views/viewImage.html'
    }).
    when('/uploads/imageinfo/:uuid/:filename', {
        templateUrl: '../views/viewImageInfo.html'
    }).
    when('/uploads/imageanno/:uuid/:filename', {
        templateUrl: '../views/viewImageAnno.html'
    }).
    when('/searchsite', {
        templateUrl: '../views/searchResult.html'
    }).


    otherwise('/');

});



app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);








app.controller('CollapseDemoCtrl', ['$http', 'Upload', '$scope', '$route','$routeParams', function ($http, Upload, $scope, $route, $routeParams) {
    var searchKeys = [];
    //console.log(val);
    $http.get('/uploads/search')
        .then(function (response) {
           // console.log(response.data)
            for (let j = 0, dataLength = response.data.length; j < dataLength; j++) {
                Object.keys(response.data[j]._id).forEach(function (key, index) {
                    //console.log(response.data[j]._id[key]);
                    for (let i = 0, l = response.data[j]._id[key].length; i < l; i++) {
                        //console.log(response.data[j]._id[key][i]);
                        if (searchKeys.indexOf(response.data[j]._id[key][i]) == -1) {
                            searchKeys.push(response.data[j]._id[key][i]);
                        }

                        
                    }
                });
            }
            $scope.tags = searchKeys; //retrieve results and add to existing results
        })
        console.log(searchKeys);
    $scope.search = function (val) {
    }

    $scope.submit = function () {
        console.log("submit");
        if ($scope.selected != undefined){
            sessionStorage.setItem("searchQuery", $scope.selected);
            console.log(sessionStorage.searchQuery);
            window.location = '#/searchsite';
            $route.reload();
            
        }
    
    }

}]);

app.controller('CtrlUpload', ['$http', 'Upload', '$scope', function ($http, Upload, $scope) {

    $http.get('/uploads').then(function (response) {
        // console.log(response.data);
        $scope.all = response.data;
        //if (sessionStorage.sessionIdentifier != null && sessionStorage.sessionName != null) {
        if (sessionStorage.Identifier != undefined && sessionStorage.Name != undefined) {
            $scope.upload = {
                sessionIdentifier: [sessionStorage.Identifier],
                sessionName: [sessionStorage.Name]
            }
        }


    });

    $scope.submit = function () {
        //console.log($scope.upload);
        Upload.upload({
            url: '/uploads',
            method: 'post',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data)
            sessionIdentifier = response.data.sessionIdentifier[0]
            sessionStorage.setItem("Identifier", sessionIdentifier);

            sessionName = response.data.sessionName[0]
            console.log(sessionName);
            sessionStorage.setItem("Name", sessionName);

            tempID = response.data.file.filename;
            sessionStorage.setItem("ID", tempID);

            tempFileName = response.data.file.originalname;
            sessionStorage.setItem("FileName", tempFileName);

            // console.log(tempID);
            // console.log(tempFileName);

            console.log(response.data);
            $scope.all.push(response.data);
            $scope.upload = {};
            console.log("Uploaded")
        })
    }
}]);
app.controller('CtrlUpdateData', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    $http.get('/uploads/image/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
        console.log(response.data);
        console.log("________Response.data[0]_______________");
        console.log(response.data[0].sessionName);
        console.log(response.data[0].sessionIdentifier);


        $scope.image = response.data;
        $scope.upload = {
            sessionName: response.data[0].sessionName,
            sessionIdentifier: response.data[0].sessionIdentifier
        };
        console.log("Beginning");
    });
    $scope.submit = function () {
        // console.log($scope.image)
        // console.log("Update")

        Upload.upload({
            url: '/uploads/updateUploadData/' + $routeParams.uuid + '/' + $routeParams.filename,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);



app.controller('CtrlUpdateImageInformation', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {

        //console.log(response.data);


        $scope.image = response.data;
        test = $scope.image
        //console.log(test[0].sessionName);
        // console.log(response.data[0].tags.imageInformation);
        // $scope.tags = ["hallo", "du", "spass"
        //     // { text: 'Tag1' },
        //     // { text: 'Tag2' },
        //     // { text: 'Tag3' }
        // ];
        // $scope.upload = {
        //     tags: response.data.tags
        // }
        //   ];
        // console.log(response.data[0].tags.imageInformation);
        // for (var index = 0; index < uploadimageInformation.artist.length; index++) {
        //     var element = {
        //         text: uploadimageInformation.artist[0]
        //     }
        //     console.log(element);
        // }


        // console.log(response.data[0].tags.imageInformation.form);

        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.imageInformation
        //     },
        // }
    });

    $scope.submit = function () {
        console.log($scope.upload);
        Object.keys($scope.upload).forEach(function (key, index) { 
            for (let index = 0; index < $scope.upload[key].length; index++) {
                console.log($scope.upload[key][index]);
                $scope.upload[key]
                
            }
            console.log($scope.upload[key]);
        });       
        Upload.upload({
            url: '/uploads/formImageInfo/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log("response= ");
            // console.log(response.data);

            $scope.image.push(response.data);
            $scope.image = test[0].sessionName;
            console.log("Update")
        })
    }
}]);


app.controller('CtrlUpdateImageDescrip', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {
        console.log(response.data);
        $scope.image = response.data;
        console.log(response.data[0]);
        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.imageInformation
        //     },
        // }
        // $scope.upload = {
        //     tags: response.data.tags
        // }
    });
    $scope.submit = function () {
        console.log($scope.upload);
        
        Upload.upload({
            url: '/uploads/formImageDes/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);


app.controller('CtrlUpdateImageDescripLoc', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {
        //console.log(response.data);
        $scope.image = response.data;

        // console.log(response.data[0].tags.imageInformation);
        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.imageInformation
        //     },
        // }
    });

    //    annotoriousService.reset();
    anno.addPlugin('VanillaREST', {
        'prefix': '/uploads',
        'urls': {
            read: '/',
            create: '/annotate/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            update: '/annotate/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            destroy: '/',
            search: '/'
        }
    })
    // $scope.submit = function () {
    //     Upload.upload({
    //         url: '/uploads/formImageDesLocation/' + sessionStorage.ID + '/' + sessionStorage.FileName,
    //         method: 'put',
    //         data: $scope.upload
    //     }).then(function (response) {
    //         // console.log(response.data);
    //         $scope.image.push(response.data);
    //         // $scope.image = {};
    //         console.log("Update")
    //     })
    // }
}]);


app.controller('CtrlUpdatePersonalRelation', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {

        console.log(response.data);



        $scope.image = response.data;
        // console.log(response.data[0].tags.imageInformation);
        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.imageInformation
        //     },
        // }
    });
    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/formPRelation/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);




app.controller('CtrlUpdatePersonalRelationSub', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams);

    // $http.get('/formImageInfo/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
    $http.get('/uploads/image/' + sessionStorage.ID + '/' + sessionStorage.FileName).then(function (response) {

        console.log(response.data);
        $scope.image = response.data;
        // console.log(response.data[0].tags.imageInformation);
        // $scope.upload = {
        //     tags: {
        //         imageInformation: response.data[0].tags.ima
    });
    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/formPRelation/' + sessionStorage.ID + '/' + sessionStorage.FileName,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }



}]);




























app.controller('formCtrlSessions', ['$http', 'Upload', '$scope', function ($http, Upload, $scope) {

    $http.get('/uploads/sessions').then(function (response) {
        //console.log(response.data);
        $scope.sessions = response.data;

        for (let j = 0, dataLength = response.data.length; j < dataLength; j++) {
            console.log(response.data[j]);
            // Object.keys(response.data[j]._id).forEach(function (key, index) {
            //     //console.log(response.data[j]._id[key]);
            //     for (let i = 0, l = response.data[j]._id[key].length; i < l; i++) {
            //         //console.log(response.data[j]._id[key][i]);
            //         if (searchKeys.indexOf(response.data[j]._id[key][i]) == -1) {
            //             searchKeys.push(response.data[j]._id[key][i]);
            //         }

                    
            //     }
            // });
        }


    });



}]);

app.controller('formCtrlAuthor', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {

    // console.log($routeParams.author);

    $http.get('/uploads/collection/' + $routeParams.author + '/' +$routeParams.id).then(function (response) {
        console.log(response.data);
        $scope.author = response.data;
    });
}]);

app.controller('CtrlSearchResult', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {
    
        // console.log($routeParams.author);
    
        $http.get('uploads/search/' + sessionStorage.searchQuery).then(function (response) {
            console.log(response.data);
            $scope.author = response.data;
        });
    }]);
    


app.controller('CtrlTopic', ['$http', 'Upload', '$scope', '$routeParams', function ($http, Upload, $scope, $routeParams) {


    // $http.get('/uploads/topics').then(function (response) {
    //     console.log(response.data);
    //     $scope.topics = response.data;
    // });


    var searchKeys = [];
    $http.get('/uploads/search')
        .then(function (response) {
           // console.log(response.data)
            for (let j = 0, dataLength = response.data.length; j < dataLength; j++) {
                Object.keys(response.data[j]._id).forEach(function (key, index) {
                    //console.log(response.data[j]._id[key]);
                    for (let i = 0, l = response.data[j]._id[key].length; i < l; i++) {
                        //console.log(response.data[j]._id[key][i]);
                        if (searchKeys.indexOf(response.data[j]._id[key][i]) == -1) {
                            searchKeys.push(response.data[j]._id[key][i]);
                        }

                        
                    }
                });
            }
            console.log(searchKeys);
            searchKeys.sort();
            console.log(searchKeys);
            
            $scope.topics = searchKeys; //retrieve results and add to existing results
        })
}]);


app.controller('RandomImage', ['$http', 'Upload', '$scope', '$routeParams', 'uuid4', function ($http, Upload, $scope, $routeParams, uuid4) {


    $http.get('/uploads/hit').then(function (response) {
        // console.log(response.data);
        $scope.image = response.data;
        //$scope.topics = response.data;
    });
}]);


app.controller('CtrlImage', ['$http', 'Upload', '$scope', '$routeParams', 'uuid4', function ($http, Upload, $scope, $routeParams, uuid4) {



    $http.get('/uploads/image/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {
        console.log(response.data);
        $scope.image = response.data;
        $scope.upload = {
            sessionName: response.data[0].sessionName,
            sessionIdentifier: response.data[0].sessionIdentifier,
            imageInformation: response.data[0].imageInformation,
            imageDescrp: response.data[0].imageDescrp,
            personalRelation: response.data[0].personalRelation,
        }


        anno.addPlugin('VanillaREST', {
            'prefix': '/uploads',
            'urls': {
                read: '/annotate/' + $routeParams.uuid + '/' + $routeParams.filename,
                create: '/annotate/' + $routeParams.uuid + '/' + $routeParams.filename,
                update: '/annotate/' + $routeParams.uuid + '/' + $routeParams.filename + '/:id',
                destroy: '/annotate/:id',
                search: '/'
            }
        })
    });


    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/updateImage/' + $routeParams.uuid + '/' + $routeParams.filename,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }

    $scope.delete = function () {
        // console.log("fuck");
        Upload.upload({
            url: '/uploads/delete/' + $routeParams.uuid + '/' + $routeParams.filename,
            method: 'delete',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            // $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
}]);


app.controller('CtrlImageInfo', ['$http', 'Upload', '$scope', '$routeParams', 'uuid4', function ($http, Upload, $scope, $routeParams, uuid4) {



    $http.get('/uploads/image/' + $routeParams.uuid + '/' + $routeParams.filename).then(function (response) {




        console.log(response.data[0]);
        $scope.image = response.data;



        anno.addPlugin('VanillaREST', {
            'prefix': '/uploads',
            'urls': {
                read: '/annotate/' + $routeParams.uuid + '/' + $routeParams.filename,
                create: '/annotate/' + $routeParams.uuid + '/' + $routeParams.filename,
                update: '/annotate/' + $routeParams.uuid + '/' + $routeParams.filename + '/:id',
                destroy: '/annotate/:id',
                search: '/'
            }
        })


        $scope.upload = {
            sessionName: response.data[0].sessionName,
            sessionIdentifier: response.data[0].sessionIdentifier,
            artist: response.data[0].artist,
            publishingYear: response.data[0].publishingYear,
            publishingLocation: response.data[0].publishingLocation,
            medium: response.data[0].medium,
            form: response.data[0].form,
            motives: response.data[0].motives,
            motivesRevolution: response.data[0].motivesRevolution,
            source: response.data[0].source,
            placeFoundFirst: response.data[0].placeFoundFirst,
            dateFoundFirst: response.data[0].dateFoundFirst,
            time: response.data[0].time,

            // imageInformation: response.data[0].imageInformation,
            // imageDescrp: response.data[0].imageDescrp,
            // personalRelation: response.data[0].personalRelation,
        }
    });


    $scope.submit = function () {
        Upload.upload({
            url: '/uploads/updateImage/' + $routeParams.uuid + '/' + $routeParams.filename,
            method: 'put',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
        })
    }
    $scope.delete = function () {
        // console.log("fuck");
        Upload.upload({
            url: '/uploads/delete/' + $routeParams.uuid + '/' + $routeParams.filename,
            method: 'delete',
            data: $scope.upload
        }).then(function (response) {
            // console.log(response.data);
            // $scope.image.push(response.data);
            // $scope.image = {};
            console.log("Update")
            window.location = '#/searchsite';
            $route.reload();
        })
    }
}]);