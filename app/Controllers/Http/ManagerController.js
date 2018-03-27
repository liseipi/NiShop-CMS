'use strict'

const User = use('App/Models/User')
const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Hash = use('Hash')

class ManagerController {

  async add({view}){
    const roleData = await Database.select('*').from('ni_auth_roles')
    const menusData = await Database.select('*').from('ni_menus')
    const formatData = await GlobalFn.treeSort(menusData)
    return view.render('manager.add', {roleData: roleData, menusData: formatData})
  }

  async addSave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_admin_user', request.all())
    //saveData.thisIp = request.ip()
    saveData.birthday = (new Date((saveData.birthday).replace(/-/g, '/'))).getTime()

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
    userInfo.birthday = GlobalFn.timestampToTime(userInfo.birthday, 'YMD')
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
    saveData.birthday = (new Date((saveData.birthday).replace(/-/g, '/'))).getTime()
    if(saveData.auth && saveData.auth.length>0){
      saveData.auth = saveData.auth.join(",")
    }else{
      saveData.auth = ''
    }
    console.log(saveData)
    try{
      await User.query().where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('/manager/list')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = ManagerController
