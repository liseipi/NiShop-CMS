'use strict'

const Helpers = use('Helpers')

class FileController {

    async store({view}){
        return view.render('file.index')
    }

    async save({request, response, view, error}){
        if (error.code === 'EBADCSRFTOKEN') {
            return 'csrfToken无效.'
        }

        const profilePics = request.file('fileselect', {
            types: ['image'],
            size: '2mb'
        })
        await profilePics.moveAll(Helpers.tmpPath('uploads'), (file) => {
            return {
                name: `${new Date().getTime()}.${file.subtype}`
            }
        })
        if (!profilePics.movedAll()) {
            return profilePics.errors()
        }

    }

}

module.exports = FileController
