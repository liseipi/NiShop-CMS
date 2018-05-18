'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Hash = use('Hash')

class ManagerController {

  async roleAdd({view}){
    const menusData = await Database.select('*').from('ni_menus')
    const formatData = await GlobalFn.treeSort(menusData)
    return view.render('role.add', {menusData: formatData})
  }

  async roleAddSave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_auth_roles', request.all())
    saveData.role_auth = saveData.role_auth.join(",")

    try{
      await Database.from('ni_auth_roles').insert(saveData)
      session.flash({notification: '新增加角色成功！'})
      response.redirect('/manager/role')
    }catch(error){
      session.flash({notification: '新增失败！'+error})
      response.redirect('back')
    }
  }

  async role({view}){
    const roleData = await Database.select('*').from('ni_auth_roles')
    return view.render('role.list', {roleData})
  }

  async roleEdit({request, response, view, params}){
    const roleInfo = await Database.table('ni_auth_roles').where('ni_id', params.id).first()
    const menusData = await Database.select('*').from('ni_menus')
    const formatData = await GlobalFn.treeSort(menusData)
    return view.render('role.edit', {roleInfo, menusData: formatData})
  }

  async roleEditSave({request, response, view, params, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_auth_roles', request.all())
    saveData.role_auth = saveData.role_auth.join(",")

    try{
      await Database.table('ni_auth_roles').where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改角色成功！'})
      response.redirect('/manager/role')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async roleDestroy({response, params, session}){
    try{
      await Database.table('ni_auth_roles').where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/manager/role')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('/manager/role')
    }
  }

  async add({view}){
    const roleData = await Database.select('*').from('ni_auth_roles')
    const menusData = await Database.select('*').from('ni_menus')
    const formatData = await GlobalFn.treeSort(menusData)
    return view.render('manager.add', {roleData: roleData, menusData: formatData})
  }

  async addSave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_admin_user', request.all())
    saveData.create_at = new Date().getTime()

    if(saveData.birthday && saveData.birthday!=''){
      //saveData.birthday = (new Date((saveData.birthday).replace(/-/g, '/'))).getTime()
      saveData.birthday = new Date(saveData.birthday).getTime()
    }else{
      delete saveData.birthday
    }

    if(saveData.mobile && saveData.mobile!=''){
      saveData.mobile = parseInt(saveData.mobile)
    }else{
      delete saveData.mobile
    }

    if(saveData.auth && saveData.auth.length>0){
      saveData.auth = saveData.auth.join(",")
    }else{
      saveData.auth = ''
    }
    //console.log(saveData)
    try{
      await User.create(saveData)
      session.flash({notification: '增加成功！'})
      response.redirect('/manager/list')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async list({view}){
    const userData = await Database.select('*').from('ni_admin_user')
    return view.render('manager.list', {userData})
  }

  async edit({request, response, view, params}){
    const userInfo = await Database.table('ni_admin_user').where('ni_id', params.id).first()
    if(userInfo === undefined){
      response.redirect('/manager/list')
      return
    }
    if(userInfo.birthday && userInfo.birthday!=''){
      userInfo.birthday = GlobalFn.timestampToTime(userInfo.birthday, 'YMD')
    }else{
      userInfo.birthday = ''
    }

    //console.log(userInfo)
    const roleData = await Database.select('*').from('ni_auth_roles')
    const menusData = await Database.select('*').from('ni_menus')
    const formatData = await GlobalFn.treeSort(menusData)

    return view.render('manager.edit', {userInfo, roleData, menusData: formatData})
  }

  async editSave({request, response, view, params, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_admin_user', request.all())
    if(saveData.password==''){
      delete saveData.password
    }else{
      saveData.password = await Hash.make(saveData.password)
    }

    if(saveData.birthday && saveData.birthday!=''){
      saveData.birthday = new Date(saveData.birthday).getTime()
    }else{
      delete saveData.birthday
    }
    if(saveData.auth && saveData.auth.length>0){
      saveData.auth = saveData.auth.join(",")
    }else{
      saveData.auth = ''
    }
    //console.log(saveData)

    try{
      await User.query().where('ni_id', params.id).update(saveData)

      session.flash({notification: '修改成功！'})
      response.redirect('/manager/list')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async destroy({response, params, session}){
    try{
      await Database.table('ni_admin_user').where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/manager/list')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('/manager/list')
    }
  }

}

module.exports = ManagerController
