'use strict';

import $ from 'jquery';
import RestInterraction from './restInterraction.js';
import Validation from './validation.js';
import Functions from './functions.js';
import Render from './render.js';

(function(){
    const currentRestInterraction = new RestInterraction();
    const currentValidation = new Validation();
    const functions = new Functions();
    const render = new Render();

    currentRestInterraction.init();

    $('body').on('click', '[name=loginButton]', function() {
        currentRestInterraction.login('[name="username"]', '[name="password"]', '[name=loginButton]',
                                        '.wrapper__footer__copyright__year');
    });//LOGIN BUTTON CLICK

    $('body').on('click', '[name=registerButton]', function() {
        const registerFieldSelectors = {
            username: '[name="username"]',
            email: '[name="email"]',
            password: '[name="password"]',
            confirmPass: '[name="confirmPass"]',
            captcha: '[name="captcha"]',
            firstname: '[name="firstname"]',
            lastname: '[name="lastname"]',
            registerButton: '[name="registerButton"]'
        };

        currentRestInterraction.registration(registerFieldSelectors);
    }); // REGISTER BUTTON CLICK

    $('body').on('click', '[name=toRegister]', function(e) {
        e.preventDefault();
        render.registerPage();
    }); //REGISTER LINK CLICK

    $('body').on('click', '[name=toLogin]', function(e) {
        e.preventDefault();
        currentRestInterraction.init();
    });// LOGIN LINK CLICK

    $('body').on('click', '[name=recoverPassLink]', function(e) {
        e.preventDefault();
        render.recoverPassPage();
    }); //FORGOT PASSWORD LINK CLICK

    $('body').on('click', '[name=recoverPassBtn]', function(e){
        e.preventDefault();
        currentRestInterraction.sendPassRecoverRequest('[name="email"]', '[name=recoverPassBtn]');
    }); //RECOVER PASSWORD BUTTON CLICK

                                                    //PROFILE HBS
    $('body').on('click', '[name="myProfile"]', function(e) {
        e.preventDefault();
        currentRestInterraction.init();
    }); //MY PROFILE LINK CLICK     
    
    $('body').on('click', '[name=profileSettings]', function(e) {
        e.preventDefault();
        currentRestInterraction.profileSettings('.wrapper__content');
    }); //SETTINGS LINK CLICK

    $('body').on('click', '[name=logout]', function(e) {
        e.preventDefault();
        currentRestInterraction.logout();
    }); //LOGOUT LINK CLICK

    $('body').on('keyup', '[name="searchUserProfiles"]', function(e) {
        if(e.keyCode==13)
           {
                currentRestInterraction.searchUserProfiles($('[name="searchUserProfiles"]').val(), '.wrapper__content__mid');
           };
    });//SEARCH FIELD ENTER PRESS

    $('body').on('click', '[name="friendName"]', function(e){
        e.preventDefault();
        const userId = $(this).data().id;
        currentRestInterraction.showUsersProfile(userId);
    }); //FRIEND NAME LINK CLICK

    $('body').on('click', '[name="userFollow"]', function(e){
        e.preventDefault();
        const userInfo = functions.getUserIdAndName(this);
        currentRestInterraction.addFriendOrEnemy(userInfo.userId, 1, userInfo.userName, '[name="userFollow"]');
    }); //FOLLOW BUTTON CLICK

    $('body').on('click', '[name="userBlock"]', function(e){
        e.preventDefault();
        const userInfo = functions.getUserIdAndName(this);
        currentRestInterraction.addFriendOrEnemy(userInfo.userId, 2, userInfo.userName, '[name="userBlock"]');
    }); //BLOCK BUTTON CLICK    

    $('body').on('click', '[name="viewFriends"]', function(e){
        e.preventDefault();
        const userId = $(this).data().id;
        currentRestInterraction.viewFriendsOrEnemies('.wrapper__content__mid', 1, userId);
    }); //View ALL CLICK(FRIENDS)

    $('body').on('click', '[name="viewEnemies"]', function(e){
        e.preventDefault();
        const userId = $(this).data().id;
        currentRestInterraction.viewFriendsOrEnemies('.wrapper__content__mid', 2, userId);   
    }); //View ALL CLICK(ENEMIES)

    $('body').on('click', '[name="deleteUserFromList"]', function(e){
        e.preventDefault();
        const userInfo = functions.getUserIdAndName(this);
        currentRestInterraction.deleteUserFromList(userInfo.userId, userInfo.userName);
    }); //DELETE USER FROM LIST CLICK
                                                    //PROFILE HBS


                                                    //SEARCH RESULTS HBS
    $('body').on('click', '[name="backToWall"]', function(e) {
        e.preventDefault();
        currentRestInterraction.init();
    }); //BACK TO WALL BUTTON CLICK     
                                                    //SEARCH RESULTS HBS


                                                    //PROFILESETTINGS HBS
    $('body').on('click', '[name="updateProfile"]', function(e){
        e.preventDefault();
        const updateInfoFields = {
            firstname: $('[name="firstname"]').val(),
            lastname: $('[name="lastname"]').val(),
            quote: $('[name="quote"]').val(),
            photo: $('[name="photo"]').val(),
            lived: $('[name="lived"]').val(),
            from: $('[name="from"]').val(),
            went: $('[name="went"]').val(),
            buttonSelector: '[name="updateProfile"]'
        }; 

        currentRestInterraction.updateProfileInfo(updateInfoFields);
        currentRestInterraction.uploadPhoto('[name="UploadForm[imageFile]"]');
    }); //UPDATE PROFILE BUTTON CLICK

    $('body').on('click', '[name="removeProfile"]', function(e){
        e.preventDefault();
        currentRestInterraction.removeProfile();
    });// REMOVE PROFILE LINK CLICK

    $('body').on('click', '[name="albumsList"]', function(e) {
        e.preventDefault();
        currentRestInterraction.getAlbums();
    });

    $('body').on('click', '#createAlbum', function(e) {
        e.preventDefault();
        currentRestInterraction.addAlbum();
    });

    $('body').on('click', '[name="albumName"]', function(e) {
        e.preventDefault();
        currentRestInterraction.openAlbum($(this).closest('li').attr('id'));
    });

    $('body').on('click', '[name="deleteAlbum"]', function() {
        currentRestInterraction.deleteAlbum($(this).parent());
    });

    // PROFILE SETTINGS TABS
    $('body').on('click', '.wrapper__profileSettings__tabs__caption__item__a:not(.active)', function(e) {
        e.preventDefault();
        $(this)
          .addClass('active').parent().siblings().find('a').removeClass('active')
          .closest('.wrapper__profileSettings__tabs').find('.wrapper__profileSettings__tabs__content').removeClass('active').eq($(this).parent().index()).addClass('active');
    });

    // REGISTER VALIDATION
    $('body').on('blur', '[name="username"]', function(){
        currentValidation.usernameValidate('[name="username"]');
    }); //USERNAME VALIDATION

    $('body').on('blur', '[name="email"]', function(){
        currentValidation.emailValidate('[name="email"]');
    }); //EMAIL VALIDATION

    $('body').on('blur', '[name="password"]', function(){
        currentValidation.passwordValidate('[name="password"]', '[name="confirmPass"]');
    }); //PASSWORD VALIDATION

    $('body').on('blur', '[name="confirmPass"]', function(){
        currentValidation.confirmPassValidate('[name="password"]', '[name="confirmPass"]');
    }); //PASSWORD MATCH VALIDATION
    
    $('body').on('keypress', '[name="password"]', function(e){
        functions.capsDetection(e, '[name="password"]');
    });//CAPS LOOK DETECTION

    $('body').on('keypress', '[name="confirmPass"]', function(e){
        functions.capsDetection(e, '[name="confirmPass"]');
    });//CAPS LOOK DETECTION

    $('body').on('blur', '[name="captcha"]', function(){
        currentValidation.captchaValidate('[name="captcha"]');
    }); //CAPTCHA VALIDATION

    $('body').on('blur', '[name="firstname"]', function(){
        currentValidation.nameValidate('[name="firstname"]');
    }); //FIRSTNAME VALIDATION

    $('body').on('blur', '[name="lastname"]', function(){
        currentValidation.nameValidate('[name="lastname"]');
    }); //LASTNAME VALIDATION

}());