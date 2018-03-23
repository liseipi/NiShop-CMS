'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

class MenuController {

  async add({view}){
    const menusData = await Database.select('*').from('ni_menus')
    const formatData = await GlobalFn.soleTreeSort(menusData)
    return view.render('menu.add', {menusData: formatData})
  }

  async addSave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_menus', request.all())

    try{
      await Database.from('ni_menus').insert(saveData)
      session.flash({notification: '菜单增加成功！'})
      response.redirect('/menu/list')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async list({view}){
    const menusData = await Database.select('*').from('ni_menus')
    const formatData = await GlobalFn.soleTreeSort(menusData)
    return view.render('/menu.list', {menusData: formatData})
  }

  async edit({request, response, view, params}){
    const menuInfo = await Database.table('ni_menus').where('ni_id', params.id).first()

    const menusData = await Database.select('ni_id', 'menuname', 'parent_id').from('ni_menus')
    const formatData = await GlobalFn.soleTreeSort([...menusData])

    const formatSubData = await GlobalFn.findSubData([...menusData], menuInfo.ni_id)

    return view.render('menu.edit', {menuInfo, menusData:formatData, subData:[].concat([menuInfo.ni_id], formatSubData)})
  }

  async editSave({request, response, view, params, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_menus', request.all())

    try{
      await Database.table('ni_menus').where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('/menu/list')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = MenuController
