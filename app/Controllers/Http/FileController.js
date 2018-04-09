'use strict'

const Helpers = use('Helpers')
const Drive = use('Drive')

class FileController {

    async destroy({view, params}){

      return 'aaa'

    }

    async pictures({view, request, response, params}){
      const oldPic = Helpers.appRoot('uploads')+'/'+params[0]
      const exists = await Drive.exists(oldPic)
      if(exists){
        return response.download(oldPic)
      }
    }

}

module.exports = FileController
