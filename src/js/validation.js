'use strict';

import $ from 'jquery';

export default class Validation {
    loginValidate(){
        var noInputErrors = false;

        if(!$('[name="username"]').val()) {
            $('.inputError').remove();
            $('[name="username"]').parent().before('<div class="inputError">Enter your login pls</div>');
        } else if(!$('[name="password"]').val()) {
                $('.inputError').remove();
                $('[name="password"]').parent().before('<div class="inputError">Enter your password pls</div>');
            } else {
                noInputErrors = true;
            };
        return noInputErrors;
    }; //LOGIN VALIDATE

    usernameValidate(){
        var loginPattern = /^[a-z]+([-_]?[a-z0-9]+){0,2}$/i;

        if (!$('[name="username"]').val()) {
            $('[name="username"]').parent().prev('.inputError').remove();
            $('[name="username"]').parent().before('<div class="inputError">Username cannot be empty!</div>');
            return false;
        } else if ($('[name="username"]').val().length < 4) {
                $('[name="username"]').parent().prev('.inputError').remove();
                $('[name="username"]').parent().before('<div class="inputError">Username cannot be less then 4 symbols!</div>');
                return false;
            } else if (!$('[name="username"]').val().match(loginPattern)) {
                $('[name="username"]').parent().prev('.inputError').remove();
                $('[name="username"]').parent().before('<div class="inputError">Only this symbols allowed: a-z, 0-9, -, _!</div>');
                return false;
            } else {
                $('[name="username"]').parent().prev('.inputError').remove();
                return true;
            };
    }; //USERNAME VALIDATE

    emailValidate(){
        const emailPattern = /^\w+@\w+\.\w{2,4}$/i;

        if(!$('[name="email"]').val()) {
            $('[name="email"]').parent().prev('.inputError').remove();
            $('[name="email"]').parent().before('<div class="inputError">E-mail cannot be empty!</div>');
            return false;
        } else if (!$('[name="email"]').val().match(emailPattern)) {
            $('[name="email"]').parent().prev('.inputError').remove();
            $('[name="email"]').parent().before('<div class="inputError">Invalid Email!</div>');
            return false;
        } else {
            $('.inputError').remove();
            return true;
        };
    }; //EMAIL VALIDATE

    passwordValidate(){
        if(!$('[name="password"]').val()) {
            $('[name="password"]').parent().prev('.inputError').remove();
            $('[name="password"]').parent().before('<div class="inputError">Password cannot be empty!</div>');
            return false;
        } else if ($('[name="password"]').val().length < 6) {
            $('[name="password"]').parent().prev('.inputError').remove();
            $('[name="password"]').parent().before('<div class="inputError">Password cannot be shorter then 6 symbols</div>');
            return false;
        } else if ($('[name="confirmPass"]').val() != '' && $('[name="confirmPass"]').val() !== $('[name="password"]').val()) {
            $('[name="password"]').parent().prev('.inputError').remove();
            $('[name="password"]').parent().before('<div class="inputError">Passwords does not match!</div>');
            return false;
        } else {
            $('[name="password"]').parent().prev('.inputError').remove();
            return true;
        };
    }; //PASSWORD VALIDATE

    confirmPassValidate(){
        if($('[name="confirmPass"]').val() == $('[name="password"]').val()) {
            $('[name="confirmPass"]').parent().prev('.inputError').remove();
            return true;
        } else {
            $('[name="confirmPass"]').parent().prev('.inputError').remove();
            $('[name="confirmPass"]').parent().before('<div class="inputError">Passwords does not match!</div>');
            return false
        }
    };//CONFIRM PASS VALIDATE

    captchaValidate(){
        if($('[name="captcha"]').val() == $('[name="captcha"]').data('random').first + $('[name="captcha"]').data('random').last) {
            $('[name="captcha"]').parent().prev('.inputError').remove();
            return true;
        } else {
            $('[name="captcha"]').parent().prev('.inputError').remove();
            $('[name="captcha"]').parent().before('<div class="inputError">Wrong CAPTCHA!</div>');
            return false;
        };
    };//CAPTCHA VALIDATE

    nameValidate(field){
        let pattern = /^[a-z]+([-_]?[a-z0-9]+){0,2}$/i
        if($(field).val() == ""){
            $(field).parent().prev('.inputError').remove();
            return true;
        } else if (!$(field).val().match(pattern)) {
            $(field).parent().prev('.inputError').remove();
            $(field).parent().before('<div class="inputError">Only this symbols allowed: a-z, 0-9, -, _!</div>');
            return false;
        } else {
            $(field).parent().prev('.inputError').remove();
            return true;
        };
    }; //NAME VALIDATE

    capsDetection(e, field){
        let character = e.keyCode ? e.keyCode : e.which;
        let sftKey = e.shiftKey ? e.shiftKey : ((character == 16) ? true : false);

        let isCapsLock = (((character >= 65 && character <= 90) && !sftKey) || ((character >= 97 && character <= 122) && sftKey));

        if (isCapsLock) {
            $(field).parent().prev('.inputError').remove();
            $(field).parent().before('<div class="inputError">CAPS LOCK is on!</div>');
        } else{
            $(field).parent().prev('.inputError').remove();
        };
    }; //CAPS DETECTION
};