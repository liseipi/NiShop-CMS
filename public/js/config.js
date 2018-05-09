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
    zyUpload: 'vendor/zyUploads/js/zyupload-1.0.0.min',
    laydate: 'vendor/laydate/laydate',
    domReady: 'lib/domReady'
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
        'css!vendor/zyUploads/css/zyupload-1.0.0.min.css',
        'jquery'
      ]
    },
    laydate: {
      deps: [
        'css!vendor/laydate/theme/default/laydate.css'
      ]
    },
  }
});
