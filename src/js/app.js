import restInterraction from './common.js'

(function(){
    let currentRestInterraction = new restInterraction();
    currentRestInterraction.init();

    $('body').on('click', '[name=loginButton]', function() {
        App.login();
    });

    $('body').on('click', '[name=registerButton]', function() {
        App.registration();
    });

    $('body').on('click', '[name=toRegister]', function(e) {
        e.preventDefault();
        App.showRegister();
    });

    $('body').on('click', '[name=toLogin]', function(e) {
        e.preventDefault();
        App.init();
    });

    $('body').on('click', '[name=recoverPass]', function(e) {
        e.preventDefault();
        App.showRecover();
    });

    $('body').on('click', '[name=logout]', function(e) {
        e.preventDefault();
        App.logout();
    });

    $('body').on('click', '[name=profileSettings]', function(e) {
        e.preventDefault();
        App.showProfileSettings();
    });

    $('body').on('click', '[name="albumsList"]', function(e) {
        e.preventDefault();
        App.getAlbums();
    });

    $('body').on('click', '#createAlbum', function(e) {
        e.preventDefault();
        App.addAlbum();
    });

    $('body').on('click', '[name="albumName"]', function(e) {
        e.preventDefault();
        App.openAlbum($(this).closest('li').attr('id'));
    });

    $('body').on('click', '[name="deleteAlbum"]', function() {
        App.deleteAlbum($(this).parent());
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
        Func.usernameValidate();
    });

    $('body').on('blur', '[name="email"]', function(){
        Func.emailValidate();
    });

    $('body').on('change', '[name="password"]', function(){
        Func.passwordValidate();
    });
}());