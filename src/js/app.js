'use strict';

import $ from 'jquery';
import RestInterraction from './restInterraction.js';
import Validation from './validation.js';


(function(){
    let currentRestInterraction = new RestInterraction();
    let currentValidation = new Validation();

    currentRestInterraction.init();

    $('body').on('click', '[name=loginButton]', function() {
        currentRestInterraction.login();
    });

    $('body').on('click', '[name=registerButton]', function() {
        currentRestInterraction.registration();
    });

    $('body').on('click', '[name=toRegister]', function(e) {
        e.preventDefault();
        currentRestInterraction.showRegister();
    });

    $('body').on('click', '[name=toLogin]', function(e) {
        e.preventDefault();
        currentRestInterraction.init();
    });

    $('body').on('click', '[name=recoverPass]', function(e) {
        e.preventDefault();
        currentRestInterraction.showRecover();
    });

    $('body').on('click', '[name=logout]', function(e) {
        e.preventDefault();
        currentRestInterraction.logout();
    });

    $('body').on('click', '[name=profileSettings]', function(e) {
        e.preventDefault();
        currentRestInterraction.showProfileSettings();
    });

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
        currentValidation.usernameValidate();
    });

    $('body').on('blur', '[name="email"]', function(){
        currentValidation.emailValidate();
    });

    $('body').on('blur', '[name="password"]', function(){
        currentValidation.passwordValidate();
    });

    $('body').on('blur', '[name="captcha"]', function(){
        currentValidation.captchaValidate();
    });
}());