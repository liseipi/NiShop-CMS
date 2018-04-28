'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

const shopInfoTable = 'ni_shop_info'

class SystemController {

  async shopInfo({view}){
    const shopInfoData = await Database.select('*').from(shopInfoTable).where('ni_id', 1).first()
    return view.render('system.shop_info', {shopInfoData})
  }

  async shopInfoSave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData(shopInfoTable, request.all())
    saveData.ni_id = 1
    saveData.logo = request.all().old_logo

    let shopMsg = `<p>商店信息保存成功。</p>`
    //上传logo
    const logoThumbInfo =  await GlobalFn.uploadPic(request, 'logo', {width:100, height:100, size:2})
    if(logoThumbInfo && logoThumbInfo.status=='error'){
      shopMsg += '<p>logo上传出错！Error: <pre><code>' + JSON.stringify(logoThumbInfo.error) +'</code></pre></p>'
    }
    if(logoThumbInfo && logoThumbInfo.status=='moved'){
      saveData.logo = logoThumbInfo.fileName
      shopMsg += '<p>logo上传成功。</p>'
    }

    try{
      const insert = Database.table(shopInfoTable).insert(saveData).toString()
      await Database.schema.raw(insert + ` ON DUPLICATE KEY UPDATE shop_name=VALUES(shop_name), shop_title=VALUES(shop_title),shop_keyword=VALUES(shop_keyword),shop_tel=VALUES(shop_tel),shop_icp=VALUES(shop_icp),logo=VALUES(logo),introduction=VALUES(introduction)`)

      session.flash({notification: '商店信息保存成功。'})
      response.redirect('back')
    }catch(error){
      session.flash({notification: '商店信息保存失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = SystemController
