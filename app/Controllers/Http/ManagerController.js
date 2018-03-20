'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

class ManagerController {

  async add({view}){
    const roleData = await Database.select('*').from('ni_auth_roles')
    return view.render('manager.add', {roleData})
  }

}

module.exports = ManagerController
