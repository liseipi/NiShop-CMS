'use strict'

const Helpers = use('Helpers')

class FileController {

    async store({view}){
        return view.render('file.index')
    }

    async save({request, response, view}){
        
        const profilePics = request.file('fileselect', {
            types: ['image'],
            size: '2mb'
        })
        console.log(profilePics)
        
        await profilePics.moveAll(Helpers.tmpPath('uploads'))
    
        if (!profilePics.movedAll()) {
            return profilePics.errors()
        }

    }

}

module.exports = FileController
