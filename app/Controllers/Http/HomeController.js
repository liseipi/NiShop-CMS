'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

class HomeController {

  async store({view, auth}){
    const menusData = await Database.select('*').from('ni_menus').where('runStatus', '=', 0)
    const menus = menusData.filter((item, index)=>{
      return (auth.user.auth.split(',')).indexOf(item.ni_id+'')>=0
    })
    //console.log(menus)
    const formatData = await GlobalFn.treeSort(menus)

    return view.render('index', {menusData: formatData})
  }

  async dashboard({view}){
    return view.render('dashboard')
  }

}

module.exports = HomeController
