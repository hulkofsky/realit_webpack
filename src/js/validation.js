'use strict';

import $ from 'jquery';
import Functions from './functions.js'

export default class Validation {
    constructor() {
        this.noValidationErrors = false;
    }

    loginValidate(loginFieldSelector, passwordFieldSelector){
        const functions = new Functions;

        if(!$(loginFieldSelector).val()) {
            functions.showMessage('inputError', loginFieldSelector, 'Enter your login pls.');
            return false;
        } else if(!$(passwordFieldSelector).val()) {
            functions.showMessage('inputError', passwordFieldSelector, 'Enter your password pls.');
            return false;
        } else {
            return true;
        };
    }; //LOGIN VALIDATE

    usernameValidate(usernameFieldSelector){
        const loginPattern = /^[a-z]+([-_]?[a-z0-9]+){0,2}$/i;
        let functions = new Functions;

        if (!$(usernameFieldSelector).val()) {
            functions.showMessage('inputError', usernameFieldSelector, 'Username cannot be empty!');
            this.noValidationErrors = false;
            return false;
        } else if ($(usernameFieldSelector).val().length < 4) {
            functions.showMessage('inputError', usernameFieldSelector, 'Username cannot be less then 4 symbols!');
            this.noValidationErrors = false;
            return false;
        } else if (!$(usernameFieldSelector).val().match(loginPattern)) {
            functions.showMessage('inputError', usernameFieldSelector, 'Only this symbols allowed: a-z, 0-9, -, _!');
            this.noValidationErrors = false;
            return false;
        } else {
            functions.messageDelete('inputError', usernameFieldSelector);
            this.noValidationErrors = true;
            return true;
        };
    }; //USERNAME VALIDATE

    emailValidate(emailFieldSelector){
        const emailPattern = /^\w+@\w+\.\w{2,4}$/i;
        const functions = new Functions;

        if(!$(emailFieldSelector).val()) {
            functions.showMessage('inputError', emailFieldSelector, 'E-mail cannot be empty!');
            this.noValidationErrors = false;
            return false;
        } else if (!$(emailFieldSelector).val().match(emailPattern)) {
            functions.showMessage('inputError', emailFieldSelector, 'Invalid Email!');
            this.noValidationErrors = false;
            return false;
        } else {
            functions.messageDelete('inputError', emailFieldSelector);
            this.noValidationErrors = true;
            return true;
        };
    }; //EMAIL VALIDATE

    passwordValidate(passwordFieldSelector, confirmPassFieldSelector){
        const functions = new Functions;

        if(!$(passwordFieldSelector).val()) {
            functions.showMessage('inputError', passwordFieldSelector, 'Password cannot be empty!');
            this.noValidationErrors = false;
            return false;
        } else if ($(passwordFieldSelector).val().length < 6) {
            functions.showMessage('inputError', passwordFieldSelector, 'Password cannot be shorter then 6 symbols!');
            this.noValidationErrors = false;
            return false;
        } else if ($(confirmPassFieldSelector).val() && $(confirmPassFieldSelector).val() !== $(passwordFieldSelector).val()) {
            functions.showMessage('inputError', confirmPassFieldSelector, 'Passwords does not match!');
            this.noValidationErrors = false;
            return false;
        } else {
            functions.messageDelete('inputError', passwordFieldSelector);
            functions.messageDelete('inputError', confirmPassFieldSelector);
            this.noValidationErrors = true;
            return true;
        };
    }; //PASSWORD VALIDATE

    confirmPassValidate(passwordFieldSelector, confirmPassFieldSelector){
        const functions = new Functions;

        if($(confirmPassFieldSelector).val() == $(passwordFieldSelector).val()) {
            functions.messageDelete('inputError', confirmPassFieldSelector);
            this.noValidationErrors = true;
            return true;
        } else {
            functions.showMessage('inputError', confirmPassFieldSelector, 'Passwords does not match!');
            this.noValidationErrors = false;
            return false
        }
    };//CONFIRM PASS VALIDATE

    captchaValidate(captchaFieldSelector){
        const functions = new Functions;
        const captchaPlaceholderParts = $(captchaFieldSelector).attr('placeholder').split('+');
        const firstNumber = +captchaPlaceholderParts[0].replace(/\D+/g,"");
        const lastNumber = +captchaPlaceholderParts[1].replace(/\D+/g,"");

        if($(captchaFieldSelector).val() == firstNumber + lastNumber) {
            functions.messageDelete('inputError', captchaFieldSelector);
            this.noValidationErrors = true;
            return true;
        } else {
            functions.showMessage('inputError', captchaFieldSelector, 'Wrong CAPTCHA!');
            this.noValidationErrors = false;
            return false;
        };
    };//CAPTCHA VALIDATE

    nameValidate(nameFieldSelector){
        const functions = new Functions();
        const pattern = /^[a-z]+([-_]?[a-z0-9]+){0,2}$/i;

        if($(nameFieldSelector).val() == ""){
            functions.messageDelete('inputError', nameFieldSelector);
            this.noValidationErrors = true;
            return true;
        } else if (!$(nameFieldSelector).val().match(pattern)) {
            functions.showMessage('inputError', nameFieldSelector, 'Only this symbols allowed: a-z, 0-9, -, _!');
            this.noValidationErrors = false;
            return false;
        } else {
            functions.messageDelete('inputError', nameFieldSelector);
            this.noValidationErrors = true;
            return true;
        };
    }; //NAME VALIDATE

    formValidate(registerFieldSelectors){
        
        this.nameValidate(registerFieldSelectors.firstname);
        this.nameValidate(registerFieldSelectors.lastname);
        this.usernameValidate(registerFieldSelectors.username);
        this.emailValidate(registerFieldSelectors.email);
        this.passwordValidate(registerFieldSelectors.password, registerFieldSelectors.confirmPass);
        this.confirmPassValidate(registerFieldSelectors.password, registerFieldSelectors.confirmPass);
        this.captchaValidate(registerFieldSelectors.captcha);

        return this.noValidationErrors;
    };//FORM VALIDATE

    profileSettingsValidate(){

    };//PROFILE SETTINGS VALIDATE
};