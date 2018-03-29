requirejs.config({
  baseUrl: '/js',
  paths: {
    jquery: 'lib/jquery.min',
    sui: 'vendor/sui3/js/sui.min',
    metisMenu: 'lib/metisMenu',
    vue: 'lib/vue.min',
    cmsui: 'lib/cmsui',
    ckedit: 'vendor/ckeditor/ckeditor',
    holder: 'lib/holder'
  },
  shim: {
    sui: {
      deps: [
        'jquery',
      ]
    },
    metisMenu: {
      deps: [
        'jquery',
      ]
    },
    cmsui: {
      deps: [
        'sui',
        'metisMenu'
      ]
    }
  }
});
