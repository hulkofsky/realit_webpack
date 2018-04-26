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
    });

    $('body').on('click', '[name=registerButton]', function() {
        currentRestInterraction.registration('[name="username"]', '[name="email"]', '[name="password"]',
                                            '[name="confirmPass"]', '[name="captcha"]', '[name="firstname"]', 
                                            '[name="lastname"]', '[name="registerButton"]');
    });

    $('body').on('click', '[name=toRegister]', function(e) {
        e.preventDefault();
        render.registerPage();
    });

    $('body').on('click', '[name=toLogin]', function(e) {
        e.preventDefault();
        currentRestInterraction.init();
    });

    $('body').on('click', '[name=recoverPassLink]', function(e) {
        e.preventDefault();
        render.recoverPassPage();
    });

    $('body').on('click', '[name=recoverPassBtn]', function(e){
        e.preventDefault();
        currentRestInterraction.sendPassRecoverRequest('[name="email"]', '[name=recoverPassBtn]');
    }); //RECOVERING PASSWORD

    $('body').on('click', '[name=logout]', function(e) {
        e.preventDefault();
        currentRestInterraction.logout();
    });

    $('body').on('click', '[name=profileSettings]', function(e) {
        e.preventDefault();
        currentRestInterraction.profileSettings('.wrapper__content');
    });

    $('body').on('click', '[name="updateProfile"]', function(e){
        e.preventDefault();
        currentRestInterraction.updateProfileInfo('[name="firstname"]', '[name="lastname"]','[name="quote"]',
                                            '[name="photo"]', '[name="lived"]', '[name="from"]', 
                                            '[name="went"]', '[name="updateProfile"]');
    }); //UPDATING PROFILE INFORMATION

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