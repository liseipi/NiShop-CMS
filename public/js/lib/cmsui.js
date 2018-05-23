define(['jquery', 'domReady', 'sui', 'metisMenu'],function($, domReady, sui, metisMenu){

  domReady(function () {
    var loadrs = function () {
      var topOffset = 50;
      var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
      if (width < 768) {
        $('div.navbar-collapse').addClass('collapse');
        topOffset = 100; // 2-row-menu
      } else {
        $('div.navbar-collapse').removeClass('collapse');
      }

      var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
      height = height - topOffset;
      if (height < 1) height = 1;
      if (height > topOffset) {
        $("#page-wrapper, #iframe-wrapper, #sidebar-navbar").css("height", (height) + "px");
      }
    }
    loadrs();
    $(window).bind("load resize", function () {
      loadrs();
    });

    var url = window.location;
    var path = location.pathname;
    var elementNav = $('ul.nav a').filter(function () {
      return this.getAttribute('data-url') == path.slice(0, path.indexOf('/', path.indexOf('/') + 1));
    }).addClass('active').parent().addClass('active').children('ul').addClass('in');

    var element = $('ul.nav a').filter(function () {
      return this.href == url;
    }).addClass('active').parent().parent().addClass('in').parent().children('a').addClass('active');

    while (true) {
      if (element.is('li')) {
        element = element.parent().addClass('in').parent();
      } else {
        break;
      }
    }

    setTimeout(function () {
      $('#notification').trigger('click');
    }, 30);
  });

});
