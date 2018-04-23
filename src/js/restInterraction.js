'use strict';

import $ from 'jquery';
import Handlebars from '../../node_modules/handlebars/dist/handlebars.min.js';
import Validation from './validation.js';
import Functions from './functions.js'

export default class RestInterraction {
    wrapper(){
        return $('.wrapper');
    };

    init(){
        let template,
            context,
            htmlContent,
            functions = new Functions(),
            _this = this;

        if(functions.isSessionToken()) {
            let sessionToken = functions.isSessionToken();

            $.ajax({
                url: 'http://restapi.fintegro.com/profiles', 
                method: 'GET',
                dataType: 'json', 
                headers: {
                    bearer: sessionToken
                },
                success: function(data) {

                    $.get('./src/views/profile.hbs', function(response){
                        template = Handlebars.compile(response);
                        context = {
                            firstName: data.profile.firstname,
                            lastName: data.profile.lastname
                        }
                        htmlContent = template(context);


                        $(_this.wrapper()).html(htmlContent);
                    });
                }

            });
        } else {
            $.get('./src/views/login.hbs', function(response){
                template = Handlebars.compile(response);
                htmlContent = template(context);
                $(_this.wrapper()).html(htmlContent);
            });

        }
    };  //INIT

    login(){
        let formValidation = new Validation();
        if (formValidation.loginValidate()) {
           let _this = this;
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
                    _this.init();

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
    }; //LOGIN

    logout(){
        document.cookie = "session-token=;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        this.init();
    }; //LOGOUT

    registration(){
        let formValidation = new Validation(),
            _this = this;

        if (formValidation.usernameValidate() && 
            formValidation.emailValidate() && 
            formValidation.passwordValidate()) {
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
                        _this.init();
                    }, 5000);
                }, 
                beforeSend: function() {
                    $('[name="registerButton"]').html('<img width="30" src="img/Cube.svg">');
                },

                error: function(xhr, status, error) {
                    $('[name="registerButton"]').html('Register');

                    let errors = ($.parseJSON(xhr.responseText)).errors;
                    console.log(errors);
                    $('[name="registerButton"]').before('<div class="inputError"></div>')

                    for(let errorItem in errors) {
                        $('.inputError').append('<p>' + errors[errorItem] + '</p>');
                    }
                }
            });
        };
    };//REGISTRATION

    showRegister(){
        let functions = new Functions(),
            firstNumber = functions.random(1, 10),
            lastNumber = functions.random(1, 10),
            _this = this;
        $.get('./src/views/register.hbs', function(response){
            let template = Handlebars.compile(response);
            $(_this.wrapper()).html(template);
            $('[name=captcha]').attr("placeholder", `Сколько будет: ${firstNumber} + ${lastNumber}?`);
            $('[name=captcha]').data("random", {first: firstNumber, last: lastNumber});
        });
    };//SHOW REGISTER

    showRecover(){
        let _this = this;
        $.get('./src/views/recoverPass.hbs', function(response){
            let template = Handlebars.compile(response);
            $(_this.wrapper()).html(template);
        });
    };//SHOW RECOVER

    showProfileSettings(){
        let _this = this;
        $.get('./src/views/profileSettings.hbs', function(response){
            let template = Handlebars.compile(response);
            $(_this.wrapper()).find('.wrapper__content').html(template);
        });
    }; //SHOW PROFILE SETTINGS

    albumsList(albums){
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
    }; //ALBUMS LIST

    getAlbums(){
        let functions = new Functions(),
            template,
            sessionToken = functions.isSessionToken(),
            _this = this;

        if(!sessionToken) {
            this.init();
            return false;
        }

        $.ajax({
            url: 'http://restapi.fintegro.com/albums',
            data: {user_id: localStorage.userID},
            method: 'GET',
            headers: {
                bearer: sessionToken
            },
            success: function (response) {
                $.get('./src/views/albums.hbs', function(response){
                    template = Handlebars.compile(response);
                    $(_this.wrapper()).find('[name="albumsContainer"]').html(template);
                });

                setTimeout(function () {
                    if(response.albums.length > 0) {
                        _this.albumsList(response.albums);
                    }
                }, 100);
            }
        });
    }; //GET ALBUMS


    addAlbum(){
        let functions = new Functions(),
            sessionToken = functions.isSessionToken(),
            _this = this;
        $.ajax({
            url: 'http://restapi.fintegro.com/albums',
            method: 'POST',
            headers: {
                bearer: sessionToken
            },
            data: {name: $('[name="createAlbum"]').val()},
            success: function (response) {
                _this.getAlbums();
            }
        });
    }; //ADD ALBUM
 
    openAlbum(){
        let functions = new Functions(),
            _this = this;
        $.ajax({
            url: 'http://restapi.fintegro.com/albums/' + albumID,
            method: 'GET',
            headers: {
                bearer: functions.isSessionToken()
            },
            success: function (response) {

                $.get('views/photos.hbs', function(response){
                    template = Handlebars.compile(response);
                    template = template(response.album[0]);
                    $(_this.wrapper).find('[name="albumsContainer"]').html(template);
                });

                setTimeout(function () {
                    _this.photosList(response.album[0].photos);
                }, 1000);
            }
        });
    }; //OPEN ALBUM

    photosList(photos){
        let photosUL = document.createElement('ul'),
            photoLI;
        $(photosUL).addClass('wrapper__profileSettings__tabs__content__photos__list');

        for(let i = 0; i < photos.length; i++) {
            photoLI = document.createElement('li');
            $(albumLI).addClass('wrapper__profileSettings__tabs__content__photos__list__item');
            $(photoLI).attr('id', photos[i].id);
            $(photoLI).append('<img class="wrapper__profileSettings__tabs__content__photos__list__item__img" src="' + photos[i].url + '" alt="photo">');
            $(photoLI).append('<div class="wrapper__profileSettings__tabs__content__photos__list__item__delete" name="deletePhoto">Delete photo</div>');
            $(photoLI).append('<p class="wrapper__profileSettings__tabs__content__photos__list__item__date">Created: ' + photos[i].created + '</p>');

            $(photosUL).append(photoLI);
        }

        $('.wrapper__profileSettings__tabs__content__photos').html(photosUL).addClass('filled');
    }; //PHOTOS LIST


    addPhoto(allbumId){
        let functions = new Functions(),
            _this = this;
        // var form = $('#addPhotoField').closest('form');
        // var formData = new FormData($(form)[0]);

        $.ajax({
            url: 'http://restapi.fintegro.com/upload',
            method: 'POST',
            headers: {
                bearer: functions.isSessionToken()
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
                        bearer: functions.isSessionToken()
                    },
                    data: {
                            album_id: albumID,
                            url: response.link
                    },
                    success: function (response) {
                        _this.openAlbum($('.album').attr('id'));
                    }
                });
            }
        });
    }; //ADD PHOTO


    deleteAlbum(albumContainer){
        let functions = new Functions(),
            _this = this;

        $.ajax({
            url: 'http://restapi.fintegro.com/albums/' + albumContainer.attr('id'),
            method: 'DELETE',
            headers: {
                bearer: functions.isSessionToken()
            },
            success: function () {
                _this.getAlbums();
            }
        });
    }; //DELETE ALBUM

    
};