'use strict';

import $ from 'jquery';
import Handlebars from '../../node_modules/handlebars/dist/handlebars.min.js';
import Validation from './validation.js';
import Functions from './functions.js';
import Render from './render.js'

export default class RestInterraction {
    wrapper(){
        return $('.wrapper');
    };

    redirectToLogin(){
        const _this = this;
        const functions = new Functions();

        functions.showModal('errorModal', 'body', 'Sorry, Your session is over. You will be redirected to login page.')
        setTimeout(function(){
            _this.init();
            functions.deleteModal('errorModal')
        }, 3000);
    }; //REDIRECT TO LOGIN

    init(){
        const functions = new Functions();
        const render = new Render();

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
                    const year = new Date();
                    const context = {
                        profile: data.profile,
                        friends: data.friends,
                        enemies: data.enemies,

                        friendsCount: data.friends_count,
                        enemiesCount: data.enemies_count,
                        currentYear: year.getFullYear(),
                        };
                    render.profilePage(data)
                }
            });
        } else {
            render.loginPage();
        }
    };  //INIT

    profileSettings(containerSelector){
        const functions = new Functions();
        const render = new Render();

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
                    render.profileSettingsPage(containerSelector, data);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };  //PROFILE SETTINGS

    showUsersProfile(userId){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: `http://restapi.fintegro.com/profiles/${userId}`, 
                method: 'GET',
                dataType: 'json', 
                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    const year = new Date();
                    const context = {
                        profile: data.profile,
                        friends: data.friends,
                        enemies: data.enemies,

                        friendsCount: data.friends_count,
                        enemiesCount: data.enemies_count,
                        currentYear: year.getFullYear(),
                        btnStatus: 'hidden'
                        };
                    render.profilePage(context);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//SHOW USERS PROFILE

    removeProfile(){
        const functions = new Functions();
        const render = new Render();
        const _this = this;

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: `http://restapi.fintegro.com/profiles/${localStorage.userId}`, 
                method: 'DELETE',
                dataType: 'json', 
                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    functions.showModal('successModal', 'body', 'Your profile succesfully deleted. You will be redirected to login page');
                    setTimeout(function(){
                        _this.logout();
                        _this.init();
                        functions.deleteModal('successModal')
                    }, 3000);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//REMOVE PROFILE

    login(usernameFieldSelector, passwordFieldSelector, loginButtonSelector, yearContainerSelector){
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
                    localStorage.userId = data.profile.user_id;
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

    searchUserProfiles(searchCriteria, containerSelector){
        const render = new Render();
        const functions = new Functions();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: 'http://restapi.fintegro.com/search', 
                method: 'GET',
                dataType: 'json',
                data: {
                    search: searchCriteria
                },

                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    render.searchResults(containerSelector, data);
                }, 

                beforeSend: function() {
                    $(containerSelector).html('<img width="30" src="img/Cube.svg">');
                }
            });
        };
    };//SEARCH USER PROFILES

    addFriendOrEnemy(userId, friendOrEnemy, userName){
        const functions = new Functions();
        const _this = this;

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: 'http://restapi.fintegro.com/social-activities', 
                method: 'POST',
                dataType: 'json',
                data: {
                    user_id: userId,
                    type: friendOrEnemy
                },

                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    if (friendOrEnemy == 1) {
                        functions.showModal('successModal', _this.wrapper(), `You added ${userName} to your friendlist.`);
                        setTimeout(function(){
                            functions.deleteModal('successModal');
                        }, 2000);
                    };
                    
                    if(friendOrEnemy == 2) {
                        functions.showModal('successModal', _this.wrapper(), `You added ${userName} to your enemies list.`);
                        setTimeout(function(){
                            functions.deleteModal('successModal');
                        }, 2000);
                    };

                }
            });
        };
    };//FOLLOW USER

    viewFriendsOrEnemies(containerSelector, friendOrEnemy, userId){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();

            $.ajax({
                url: `http://restapi.fintegro.com/social-activities/${userId}`, 
                method: 'GET',
                dataType: 'json',

                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    let context;
                    if(friendOrEnemy == 1){
                        if(localStorage.userId != userId) {
                            context = {
                                btnStatus: 'hidden',
                                userList: data.friends,
                                typeOfList: 'friends'
                            };
                        } else {
                            context = {
                                userList: data.friends,
                                typeOfList: 'friends'
                            };
                        };
                        render.allFriendsOrEnemies(containerSelector, context);
                    };
                    
                    if(friendOrEnemy == 2){
                        if(localStorage.userId != userId) {
                            context = {
                                btnStatus: 'hidden',
                                userList: data.enemies,
                                typeOfList: 'enemies'
                            };
                        } else {
                            context = {
                                userList: data.enemies,
                                typeOfList: 'enemies'
                            };
                        };
                        render.allFriendsOrEnemies(containerSelector, context);
                    };    
                }
            });
        };
    };//VIEW FRIENDS OR ENEMIES

    deleteUserFromList(userId, userName){
        const functions = new Functions();
        const render = new Render();
        const _this = this;

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            $.ajax({
                url: `http://restapi.fintegro.com/social-activities/${userId}`, 
                method: 'DELETE',
                dataType: 'json', 
                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    functions.showModal('successModal', 'body', `${userName} succesfully deleted.`);
                    setTimeout(function(){
                        functions.deleteModal('successModal')
                    }, 2000);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//DELETE USER FROM LIST

    registration(registerFieldSelectors){

        const formValidation = new Validation();
        const functions = new Functions();
        const _this = this;
        const noValidationErrors = formValidation.formValidate(registerFieldSelectors);

        if (noValidationErrors) {
            $.ajax({
                url: 'http://restapi.fintegro.com/registration', 
                method: 'POST',
                dataType: 'json',
                data: {
                    login: $(registerFieldSelectors.username).val(),
                    email: $(registerFieldSelectors.email).val(),
                    password: $(registerFieldSelectors.password).val(),
                    firstname: $(registerFieldSelectors.firstname).val(),
                    lastname: $(registerFieldSelectors.lastname).val()
                },

                success: function(data) {
                    functions.messageDelete('inputError', registerFieldSelectors.registerButton)
                    functions.showMessage('success', registerFieldSelectors.registerButton, 'Your account was succesfully created!');    
                    setTimeout(function(){
                        _this.init();
                    }, 3000);
                }, 

                beforeSend: function() {
                    $(registerFieldSelectors.registerButton).html('<img width="30" src="img/Cube.svg">');
                },

                error: function(xhr) {
                    const errors = ($.parseJSON(xhr.responseText)).errors;

                    $(registerFieldSelectors.registerButton).html('Register');
                    functions.showMessage('inputError', registerFieldSelectors.registerButton, '');

                    for(let errorItem in errors) {
                        $('.inputError').append(`<p>${errors[errorItem]}</p>`);
                    };
                }

            });
        };
    };//REGISTRATION

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
                    $(buttonSelector).html('Send');
                }, 
                beforeSend: function() {
                    $(buttonSelector).html('<img width="30" src="img/Cube.svg">');
                },
    
                error: function(xhr) {
                    $(buttonSelector).html('Send');
                    if(xhr.status == 404){
                        functions.showMessage('inputError', buttonSelector, 'This Email is not registered in our database.');
                    } else {
                        functions.showMessage('inputError', buttonSelector, 'Internal server error.');
                    };   
                }
            });
        };
    };//RECOVER PASSWORD

    updateProfileInfo(updateInfoFields){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            let userId;

            $.ajax({
                url: `http://restapi.fintegro.com/profiles/${localStorage.userId}`, 
                method: 'PUT',
                dataType: 'json', 

                data: {
                    firstname: updateInfoFields.firstname,
                    lastname: updateInfoFields.lastname,
                    quote: updateInfoFields.quote,
                    photo: updateInfoFields.photo,
                    lived: updateInfoFields.lived,  
                    from: updateInfoFields.from,
                    went: updateInfoFields.went
                },

                headers: {
                    bearer: sessionToken
                },

                success: function(data) {
                    functions.showMessage('success', updateInfoFields.buttonSelector, 'Your personal information has been updated succesfully!')
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//UPDATE PROFILE SETTINGS

    uploadPhoto(fieldSelector){
        const functions = new Functions();
        const render = new Render();

        if(functions.isSessionToken()) {
            const sessionToken = functions.isSessionToken();
            let formData = new FormData();
            let file = $(fieldSelector).prop('files')[0];
            console.log(fieldSelector);
            console.log(file);

            formData.append('fff', 'fff');
            formData.append('userPhoto', file, 'profilephoto.jpg');
            console.log(formData);

            $.ajax({
                url: `http://restapi.fintegro.com/upload`, 
                method: 'POST',
                dataType: 'json', 

                data: formData,

                headers: {
                    bearer: sessionToken
                },

                crossDomain: true,
                cache: false,
                contentType: false,
                processData: false,

                success: function(data) {
                    console.log(data);
                }
            });
        } else {
            this.redirectToLogin();
        }
    };//UPLOAD PHOTO

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
 
    openAlbum(albumID){
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