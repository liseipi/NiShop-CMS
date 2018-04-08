'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Helpers = use('Helpers')
const Drive = use('Drive')

const categoryTable = 'ni_goods_categories'
const brandsTable = 'ni_brands'
const goodsTable = 'ni_goods'

class GoodsController {

  async category({view}){
    const categoryData = await Database.select('*').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)
    return view.render('goods.category', {categoryData: formatData})
  }

  async categoryAdd({view}){
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)
    return view.render('goods.category_add', {categoryData: formatData})
  }

  async categorySave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData(categoryTable, request.all())

    try{
      await Database.from(categoryTable).insert(saveData)
      session.flash({notification: '增加成功！'})
      response.redirect('/goods/category')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async categoryEdit({request, response, view, params}){
    const columnInfo = await Database.table(categoryTable).where('ni_id', params.id).first()

    const columnData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort([...columnData])

    const formatSubData = await GlobalFn.findSubData([...columnData], columnInfo.ni_id)

    return view.render('goods.category_edit', {columnInfo, columnData:formatData, subData:formatSubData})
  }

  async categoryEditSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(categoryTable, request.all())

    try{
      await Database.table(categoryTable).where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('/goods/category')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async categoryDestroy({response, params, session}){
    const columnData = await Database.select('ni_id', 'parent_id').from(categoryTable)
    const formatSubData = await GlobalFn.findSubData([...columnData], params.id)

    if(formatSubData.length>0){
      session.flash({notification: '删除失败，当前项包含子列表！'})
      response.redirect('back')
      return
    }

    try{
      await Database.table(categoryTable).where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/goods/category')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

  async brands({view}){
    const brandsData = await Database.select('ni_id', 'brands_name', 'brands_logo', 'status', 'sort').from(brandsTable)
    return view.render('goods.brands', {brandsData})
  }

  async brandsAdd({view}){
    return view.render('goods.brands_add')
  }

  async brandsSave({request, response, session}){
    const profilePic = request.file('brands_logo', {
      types: ['image'],
      size: '1mb'
    })
    if(profilePic.clientName){
      //Helpers.appRoot('uploads')
      await profilePic.move(Helpers.publicPath('uploads'), {
        name: `${new Date().getTime()}.${profilePic.clientName.replace(/^.+\./,'')}`
      })
      if (!profilePic.moved()) {
        session.flash({notification: '图片上传失败！Error:'+ profilePic.error().message})
        response.redirect('back')
        return
      }
    }

    const saveData = await GlobalFn.formatSubmitData(brandsTable, request.all())
    if(profilePic.fileName){
      saveData.brands_logo = profilePic.fileName
    }
    try{
      await Database.from(brandsTable).insert(saveData)
      session.flash({notification: '增加成功！'})
      response.redirect('/goods/brands')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }

  }

  async brandsEdit({request, response, view, params}){
    const brandsInfo = await Database.table(brandsTable).where('ni_id', params.id).first()
    return view.render('goods.brands_edit', {brandsInfo})
  }

  async brandsEditSave({request, response, params, session}){
    const profilePic = request.file('brands_logo', {
      types: ['image'],
      size: '1mb'
    })
    if(profilePic.clientName){
      //Helpers.appRoot('uploads')
      await profilePic.move(Helpers.publicPath('uploads'), {
        name: `${new Date().getTime()}.${profilePic.clientName.replace(/^.+\./,'')}`
      })
      if (!profilePic.moved()) {
        session.flash({notification: '图片上传失败！Error:'+ profilePic.error().message})
        response.redirect('back')
        return
      }
    }

    const saveData = await GlobalFn.formatSubmitData(brandsTable, request.all())
    if(profilePic.fileName){
      saveData.brands_logo = profilePic.fileName

      const brandsInfo = await Database.select('brands_logo').table(brandsTable).where('ni_id', params.id).first()
      const oldPic = Helpers.publicPath('uploads')+'/'+brandsInfo.brands_logo
      const exists = await Drive.exists(oldPic)
      if(exists){
        await Drive.delete(oldPic)
      }
    }

    try{
      await Database.table(brandsTable).where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('/goods/brands')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async brandsDestroy({response, params, session}){
    const brandsInfo = await Database.select('brands_logo').table(brandsTable).where('ni_id', params.id).first()
    const oldPic = Helpers.publicPath('uploads')+'/'+brandsInfo.brands_logo
    const exists = await Drive.exists(oldPic)
    if(exists){
      await Drive.delete(oldPic)
    }

    try{
      await Database.table(brandsTable).where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/goods/brands')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = GoodsController
