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
};

// var Func = {
//     reloadJS: function (src) {
//         $('script[src="' + src + '"]').remove();
//         $('<script>').attr('src', src).appendTo('head');
//     }
// };