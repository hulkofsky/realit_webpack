'use strict';

import $ from 'jquery';
import Handlebars from '../../node_modules/handlebars/dist/handlebars.min.js';
import Validation from './validation.js';
import Functions from './functions.js'

export default class RestInterraction {
    wrapper(){
        return $('.wrapper');
    };

    init(yearContainerSelector){
        const functions = new Functions();
        const _this = this;

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: 'http://restapi.fintegro.com/profiles', 
                method: 'GET',
                dataType: 'json', 
                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    $.get('./src/views/profile.hbs', function(response){
                        const template = Handlebars.compile(response);
                        const context = {
                            firstName: data.profile.firstname,
                            lastName: data.profile.lastname
                        }
                        const htmlContent = template(context);
                        const year = new Date();

                        $(_this.wrapper()).html(htmlContent);
                        $(yearContainerSelector).html(year.getFullYear());
                    });
                }
            });
        } else {
            $.get('./src/views/login.hbs', function(response){
                const template = Handlebars.compile(response);
                const htmlContent = template();
                $(_this.wrapper()).html(htmlContent);
            });

        }
    };  //INIT

    login(usernameFieldSelector, passwordFieldSelector, loginButtonSelector){
        const formValidation = new Validation();
        const functions = new Functions();

        if (formValidation.loginValidate(usernameFieldSelector, passwordFieldSelector)) {
           let _this = this;
            $.ajax({
                url: 'http://restapi.fintegro.com/login', 
                method: 'POST',
                dataType: 'json',
                data: {
                    username: $(usernameFieldSelector).val(),
                    password: $(passwordFieldSelector).val()
                },
                
                success: function(data) {
                    const date = new Date(new Date().getTime() + 6000 * 1000);

                    document.cookie = `session-token=${data.token}; expires=${date.toUTCString()}`;
                    _this.init();
                }, 
                beforeSend: function() {
                    $(loginButtonSelector).html('<img width="30" src="img/Cube.svg">');
                },

                error: function(xhr, status, error) {
                    $('.inputError').remove();
                    functions.showMessage('inputError', loginButtonSelector, 'User with this login/password combination not found!');
                    $(loginButtonSelector).html('Login');
                }
            });
        };
    }; //LOGIN

    logout(){
        document.cookie = 'session-token=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
        this.init();
    }; //LOGOUT

    registration(usernameFieldSelector, emailFieldSelector, passwordFieldSelector, confirmPassFieldSelector, 
                captchaFieldSelector, firstNameFieldSelector, lastNameFieldSelector, buttonSelector){

        const formValidation = new Validation();
        const functions = new Functions();
        const _this = this;
        const noValidationErrors = formValidation.formValidate(usernameFieldSelector, emailFieldSelector, passwordFieldSelector, 
            confirmPassFieldSelector, captchaFieldSelector, firstNameFieldSelector, lastNameFieldSelector);

        if (noValidationErrors) {
            $.ajax({
                url: 'http://restapi.fintegro.com/registration', 
                method: 'POST',
                dataType: 'json',
                data: {
                    login: $(usernameFieldSelector).val(),
                    email: $(emailFieldSelector).val(),
                    password: $(passwordFieldSelector).val(),
                    firstname: $(firstNameFieldSelector).val(),
                    lastname: $(lastNameFieldSelector).val()
                },

                success: function(data) {
                    functions.messageDelete('inputError', buttonSelector)
                    functions.showMessage('success', buttonSelector, 'Your account was succesfully created!');    
                    setTimeout(function(){
                        _this.init();
                    }, 5000);
                }, 

                beforeSend: function() {
                    $(buttonSelector).html('<img width="30" src="img/Cube.svg">');
                },

                error: function(xhr, status, error) {
                    const errors = ($.parseJSON(xhr.responseText)).errors;

                    $(buttonSelector).html('Register');
                    functions.showMessage('inputError', buttonSelector, '');

                    for(let errorItem in errors) {
                        $('.inputError').append(`<p>${errors[errorItem]}</p>`);
                    };
                }

            });
        };
    };//REGISTRATION

    showRegister(captchaFieldSelector){
        const functions = new Functions();
        const firstNumber = functions.random(1, 10);
        const lastNumber = functions.random(1, 10);
        const _this = this;
        $.get('./src/views/register.hbs', function(response){
            const template = Handlebars.compile(response);
            $(_this.wrapper()).html(template);
            $(captchaFieldSelector).attr("placeholder", `Сколько будет: ${firstNumber} + ${lastNumber}?`);
            $(captchaFieldSelector).data("random", {first: firstNumber, last: lastNumber});
        });
    };//SHOW REGISTER

    showRecover(){
        const _this = this;
        $.get('./src/views/recoverPass.hbs', function(response){
            const template = Handlebars.compile(response);
            $(_this.wrapper()).html(template);
        });
    };//SHOW RECOVER

    sendPassRecoverRequest(emailFieldSelector, buttonSelector){
        const functions = new Functions();
        const formValidation = new Validation();

        if(formValidation.emailValidate(emailFieldSelector)){
            $.ajax({
                url: 'http://restapi.fintegro.com/recovery', 
                method: 'POST',
                dataType: 'json',
                data: {
                    email: $(emailFieldSelector).val()
                },
                success: function(data) {
                    functions.messageDelete('inputError', buttonSelector);
                    functions.showMessage('success', buttonSelector, 'A new password was send to your Email!');
                }, 
                beforeSend: function() {
                    $(buttonSelector).html('<img width="30" src="img/Cube.svg">');
                },
    
                error: function(xhr, status, error) {
                    $(buttonSelector).html('Send');
                    functions.showMessage('inputError', buttonSelector, 'An error has been occured.');
                }
            });
        };
    };//RECOVER PASSWORD

    showProfileSettings(containerSelector){
        const _this = this;
        $.get('./src/views/profileSettings.hbs', function(response){
            const template = Handlebars.compile(response);
            $(_this.wrapper()).find(containerSelector).html(template);
        });
    }; //SHOW PROFILE SETTINGS

    albumsList(albums){
        let albumsUL = document.createElement('ul');
        let albumLI;
        $(albumsUL).addClass();

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