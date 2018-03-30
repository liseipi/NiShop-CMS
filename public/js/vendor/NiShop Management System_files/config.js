requirejs.config({
  baseUrl: '/js',
  paths: {
    jquery: 'lib/jquery.min',
    sui: 'vendor/sui3/js/sui.min',
    metisMenu: 'lib/metisMenu',
    vue: 'lib/vue.min',
    cmsui: 'lib/cmsui',
    ckedit: 'vendor/ckeditor/ckeditor',
    holder: 'lib/holder',
    zyFile: 'vendor/zyUploads/zyFile',
    zyUpload: 'vendor/zyUploads/zyUpload',
  },
  map: {
    '*': {
      'css': 'lib/css.min'
    } 
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
    },
    zyUpload: {
      deps: [
        'css!vendor/zyUploads/zyUpload.css',
        'jquery',
        'zyFile'
      ]
    }
  }
});
