'use strict';

var Render = {
    loginPage: function () {
        this.createRoute('views/pages/login.hbs', App.wrapper);
    },
  
    profilePage: function (data) {
        var context = {
            firstName: data.profile.firstname,
            lastName: data.profile.lastname
        };
  
        this.createRoute('views/pages/profile.hbs', App.wrapper, context);
    },
  
    registerPage: function () {
      this.createRoute('views/pages/register.hbs', App.wrapper);
    },
  
    albumsPage: function () {
        this.createRoute('views/pages/albums.hbs', App.wrapper);
    },
  
    albumPage: function (album) {
        this.createRoute('views/pages/album.hbs', App.wrapper, album);
    },
  
    navUser: function () {
        this.createRoute('views/modules/header-nav-authorized.hbs', App.header);
    },
  
    navGuest: function () {
        this.createRoute('views/modules/header-nav-unauthorized.hbs', App.header);
    },
  
    addAlbumForm: function () {
        this.createRoute('views/modules/add-album-form.hbs', $('.add-album-container'));
  
        setTimeout(function () {
            $('.add-album-form').slideDown();
        }, 500);
    },
  
    addPhotoForm: function () {
        this.createRoute('views/modules/add-photo-form.hbs', $('.add-photo-container'));
  
        setTimeout(function () {
            $('.add-photo-form').slideDown();
        }, 500);
    },
  
    createRoute: function (url, container, context) {
        var template;
  
        $.get(url, function (response) {
            template = Handlebars.compile(response);
  
            if(context) {
                template = template(context);
            }
            container.html(template);
        });
    }
  };