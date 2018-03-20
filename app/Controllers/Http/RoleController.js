'use strict'
const Role = use('App/Models/Role')
const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

class RoleController {

  async add({view}){
    return view.render('role.add')
  }

  async addSave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_auth_roles', request.all())
    saveData.role_auth = saveData.role_auth.join(",")

    try{
      await Database.from('ni_auth_roles').insert(saveData)
      session.flash({notification: '新增加角色成功！'})
      response.redirect('/role/list')
    }catch(error){
      session.flash({notification: '新增失败！'+error})
      response.redirect('back')
    }
  }

  async list({view}){
    const roleData = await Database.select('*').from('ni_auth_roles')
    return view.render('role.list', {roleData})
  }

  async edit({request, response, view, params}){
    const roleInfo = await Database.table('ni_auth_roles').where('ni_id', params.id).first()
    return view.render('role.edit', {roleInfo})
  }

  async editSave({request, response, view, params, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_auth_roles', request.all())
    saveData.role_auth = saveData.role_auth.join(",")

    try{
      await Database.table('ni_auth_roles').where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改角色成功！'})
      response.redirect('/role/list')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async destroy({response, params, session}){
    try{
      await Database.table('ni_auth_roles').where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/role/list')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('/role/list')
    }
  }

}

module.exports = RoleController
