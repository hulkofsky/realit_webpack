'use strict';
import $ from 'jquery'

class restInterraction {
    init(){
        var template,
            context,
            htmlContent;

        if(Func.isSessionToken()) {
            var sessionToken = Func.isSessionToken();

            $.ajax({
                url: 'http://restapi.fintegro.com/profiles', 
                method: 'GET',
                dataType: 'json', 
                headers: {
                  bearer: sessionToken
                },
                success: function(data) {

                    $.get('views/profile.hbs', function(response){
                        template = Handlebars.compile(response);
                        context = {
                            firstName: data.profile.firstname,
                            lastName: data.profile.lastname
                        }
                        htmlContent = template(context);

                        $(App.wrapper).html(htmlContent);
                    });
                }

            });
        } else {
            $.get('views/login.hbs', function(response){
                template = Handlebars.compile(response);
                htmlContent = template(context);
                $(App.wrapper).html(htmlContent);
            });

        }
    };  //INIT


    login(){
        
    }; //LOGIN


    showProfileSettings(){
        
    }; //SHOW PROFILE SETTINGS


    getAlbums(){
        
    }; //GET ALBUMS


    addAlbum(){
        
    }; //ADD ALBUM


    albumsList(){
            
    }; //ALBUMS LIST
 

    photosList(){
       
    }; //PHOTOS LIST


    addPhoto(){
        
    }; //ADD PHOTO


    deleteAlbum(albumContainer){
        
    }; //DELETE ALBUM

    
};

var App = {
    wrapper: $('.wrapper'),

    init: function() {
        var template,
            context,
            htmlContent;

        if(Func.isSessionToken()) {
            var sessionToken = Func.isSessionToken();

            $.ajax({
                url: 'http://restapi.fintegro.com/profiles', 
                method: 'GET',
                dataType: 'json', 
                headers: {
                  bearer: sessionToken
                },
                success: function(data) {

                    $.get('views/profile.hbs', function(response){
                        template = Handlebars.compile(response);
                        context = {
                            firstName: data.profile.firstname,
                            lastName: data.profile.lastname
                        }
                        htmlContent = template(context);

                        $(App.wrapper).html(htmlContent);
                    });
                }

            });
        } else {
            $.get('views/login.hbs', function(response){
                template = Handlebars.compile(response);
                htmlContent = template(context);
                $(App.wrapper).html(htmlContent);
            });

        }
    },

    login: function() {
        if (Func.loginValidate()) {
            $.ajax({
                url: 'http://restapi.fintegro.com/login', 
                method: 'POST',
                dataType: 'json',
                data: {
                    username: $('.wrapper__form [name="username"]').val(),
                    password: $('.wrapper__form [name="password"]').val()
                },
                success: function(data) {
                    $('[name="login"]').html('Login');


                    var date = new Date(new Date().getTime() + 6000 * 1000);

                    document.cookie = 'session-token=' + data.token + '; expires=' + date.toUTCString();

                    App.init();

                }, 
                beforeSend: function() {
                    $('[name="loginButton"]').html('<img width="30" src="img/Cube.svg">');
                },

                error: function(xhr, status, error) {
                    $('.inputError').remove();
                    $('[name="loginButton"]').html('Login')
                        .before('<div class="inputError">User with this login/password combination not found</div>');
                }
            });
        };
    },

    showProfileSettings: function(){
        $.get('views/profileSettings.hbs', function(response){
            var template = Handlebars.compile(response);
            $(App.wrapper).find('.wrapper__content').html(template);
        });
    },

    getAlbums: function () {
        var template

        if(!Func.isSessionToken()) {
            App.init();
            return false;
        }

        var sessionToken = Func.isSessionToken();

        $.ajax({
            url: 'http://restapi.fintegro.com/albums',
            data: {user_id: localStorage.userID},
            method: 'GET',
            headers: {
                bearer: sessionToken
            },
            success: function (response) {
                $.get('views/albums.hbs', function(response){
                    template = Handlebars.compile(response);
                    $(App.wrapper).find('[name="albumsContainer"]').html(template);
                });

                setTimeout(function () {
                    if(response.albums.length > 0) {
                        App.albumsList(response.albums);
                    }
                }, 100);
            }
        });
    },

    addAlbum: function () {
        var sessionToken = Func.isSessionToken();

        $.ajax({
            url: 'http://restapi.fintegro.com/albums',
            method: 'POST',
            headers: {
                bearer: sessionToken
            },
            data: {name: $('[name="createAlbum"]').val()},
            success: function (response) {
                App.getAlbums();
            }
        });
    },

    albumsList: function (albums) {
        var albumsUL = document.createElement('ul');
        var albumLI;
        $(albumsUL).addClass('wrapper__profileSettings__tabs__content__albums__list');

        for(var i = 0; i < albums.length; i++) {
            albumLI = document.createElement('li');
            $(albumLI).addClass('wrapper__profileSettings__tabs__content__albums__list__item');
            $(albumLI).attr('id', albums[i].id);
            $(albumLI).append('<div class="wrapper__profileSettings__tabs__content__albums__list__item__image"></div>');
            $(albumLI).append('<a class="wrapper__profileSettings__tabs__content__albums__list__item__name" href="#" name="albumName">' + albums[i].name + '</a>');
            $(albumLI).append('<a class="wrapper__profileSettings__tabs__content__albums__list__item__delete" href="#" name="deleteAlbum">Delete album</a>');
            $(albumLI).append('<p class="wrapper__profileSettings__tabs__content__albums__list__item__date">Created: ' + albums[i].created + '</p>');

            $(albumsUL).append(albumLI);
        }

        $('.wrapper__profileSettings__tabs__content__albums').html(albumsUL).addClass('filled');
    },

    photosList: function (photos) {
        var photosUL = document.createElement('ul');
        var photoLI;
        $(photosUL).addClass('wrapper__profileSettings__tabs__content__photos__list');

        for(var i = 0; i < photos.length; i++) {
            photoLI = document.createElement('li');
            $(albumLI).addClass('wrapper__profileSettings__tabs__content__photos__list__item');
            $(photoLI).attr('id', photos[i].id);
            $(photoLI).append('<img class="wrapper__profileSettings__tabs__content__photos__list__item__img" src="' + photos[i].url + '" alt="photo">');
            $(photoLI).append('<div class="wrapper__profileSettings__tabs__content__photos__list__item__delete" name="deletePhoto">Delete photo</div>');
            $(photoLI).append('<p class="wrapper__profileSettings__tabs__content__photos__list__item__date">Created: ' + photos[i].created + '</p>');

            $(photosUL).append(photoLI);
        }

        $('.wrapper__profileSettings__tabs__content__photos').html(photosUL).addClass('filled');
    },

    addPhoto: function (albumID) {
        // var form = $('#addPhotoField').closest('form');
        // var formData = new FormData($(form)[0]);

        $.ajax({
            url: 'http://restapi.fintegro.com/upload',
            method: 'POST',
            headers: {
                bearer: Func.isSessionToken()
            },
            data: formData,
            crossDomain: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                $.ajax({
                    url: 'http://restapi.fintegro.com/photos',
                    method: 'POST',
                    headers: {
                        bearer: Func.isSessionToken()
                    },
                    data: {
                            album_id: albumID,
                            url: response.link
                    },
                    success: function (response) {
                        App.openAlbum($('.album').attr('id'));
                    }
                });
            }
        });
    },

    deleteAlbum: function (albumContainer) {
        $.ajax({
            url: 'http://restapi.fintegro.com/albums/' + albumContainer.attr('id'),
            method: 'DELETE',
            headers: {
                bearer: Func.isSessionToken()
            },
            success: function () {
                App.getAlbums();
            }
        });
    },

    openAlbum: function (albumID) {
        $.ajax({
            url: 'http://restapi.fintegro.com/albums/' + albumID,
            method: 'GET',
            headers: {
                bearer: Func.isSessionToken()
            },
            success: function (response) {

                $.get('views/photos.hbs', function(response){
                    template = Handlebars.compile(response);
                    template = template(response.album[0]);
                    $(App.wrapper).find('[name="albumsContainer"]').html(template);
                });

                setTimeout(function () {
                    App.photosList(response.album[0].photos);
                }, 1000);
            }
        });
    },

    showRegister: function(){
        $.get('views/register.hbs', function(response){
            var template = Handlebars.compile(response);
            $(App.wrapper).html(template);
        });

        var firstNumber = Math.floor(Math.random() * (10 - 1)) + 1;
        var lastNumber = Math.floor(Math.random() * (10 - 1)) + 1;

        $('[name="captcha"]').attr('placeholder', 'Сколько будет ' + firstNumber + '+' + lastNumber);
    },

    showRecover: function(){
        $.get('views/recoverPass.hbs', function(response){
            var template = Handlebars.compile(response);
            $(App.wrapper).html(template);
        });
    },

    registration: function() {
        if (Func.usernameValidate() && Func.emailValidate() && Func.passwordValidate()) {
            $.ajax({
                url: 'http://restapi.fintegro.com/registration', 
                method: 'POST',
                dataType: 'json',
                data: {
                    login: $('[name="username"]').val(),
                    email: $('[name="email"]').val(),
                    password: $('[name="password"]').val(),
                    firstname: $('[name="firstname"]').val(),
                    lastname: $('[name="lastname"]').val()
                },
                success: function(data) {
                    $('[name="registerButton"]').html('Register')
                        .before('<div class="success">Your account was succesfully created!</div>');
                    
                    setTimeout(function(){
                        App.init();
                    }, 5000);
                }, 
                beforeSend: function() {
                    $('[name="registerButton"]').html('<img width="30" src="img/Cube.svg">');
                },

                error: function(xhr, status, error) {
                    $('[name="registerButton"]').html('Register');

                    var errors = ($.parseJSON(xhr.responseText)).errors;
                    console.log(errors);
                    $('[name="registerButton"]').before('<div class="inputError"></div>')

                    for(var errorItem in errors) {
                        $('.inputError').append('<p>' + errors[errorItem] + '</p>');
                    }
                }
            });
        };
    },

    logout: function() {
        document.cookie = "session-token=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        App.init();
    }
};