'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

const categoryTable = 'ni_goods_categories'
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

  async categoryEditSave({request, response, view, params, session}){
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
    const columnData = await Database.select('ni_id', 'parent_id').from('ni_article_categories')
    const formatSubData = await GlobalFn.findSubData([...columnData], params.id)

    if(formatSubData.length>0){
      session.flash({notification: '删除失败，当前项包含子菜单！'})
      response.redirect('back')
      return
    }

    try{
      await Database.table('ni_article_categories').where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/article/category')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('/article/category')
    }
  }

}

module.exports = GoodsController
