'use strict';
import $ from 'jquery'

export default class Functions {
    random(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }; //RANDOM

    isSessionToken(){
        let cookies = document.cookie.split('; '),
            sessionToken;

        for(let i = 0; i < cookies.length; i++) {

            if(cookies[i].indexOf('session-token') !== -1) {
                sessionToken = cookies[i].split('=')[1];
                break;
            };
        };

        return sessionToken;
    }; // IS SESSION TOKEN 

    showMessage(errorSuccsessClassName, fieldSelector, message){
        $(fieldSelector).parent().prev(`.${errorSuccsessClassName}`).remove();
        $(fieldSelector).parent().before(`<div class="${errorSuccsessClassName}">${message}</div>`);
    };//SHOW MESSAGE

    messageDelete(errorSuccsessClassName, fieldSelector){
        $(fieldSelector).parent().prev(`.${errorSuccsessClassName}`).remove();
    };//MESSAGE DELETE

    capsDetection(e, fieldSelector){
        let functions = new Functions,
            character = e.keyCode ? e.keyCode : e.which,
            sftKey = e.shiftKey ? e.shiftKey : ((character == 16) ? true : false),
            isCapsLock = (((character >= 65 && character <= 90) && !sftKey) || ((character >= 97 && character <= 122) && sftKey));

        if (isCapsLock) {
            functions.showMessage('inputError', fieldSelector, 'CAPS LOCK is on!');
        } else{
            functions.messageDelete('inputError', fieldSelector);
        };
    }; //CAPS DETECTION
};

// var Func = {
//     reloadJS: function (src) {
//         $('script[src="' + src + '"]').remove();
//         $('<script>').attr('src', src).appendTo('head');
//     }
// };