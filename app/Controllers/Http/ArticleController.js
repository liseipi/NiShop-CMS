'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

class ArticleController {

  async category({view}){
    const categoryData = await Database.select('*').from('ni_article_categories')
    const formatData = await GlobalFn.soleTreeSort(categoryData)
    return view.render('article.category', {categoryData: formatData})
  }

  async categoryAdd({view}){
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from('ni_article_categories')
    const formatData = await GlobalFn.soleTreeSort(categoryData)
    return view.render('article.category_add', {categoryData: formatData})
  }

  async categorySave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_article_categories', request.all())

    try{
      await Database.from('ni_article_categories').insert(saveData)
      session.flash({notification: '增加成功！'})
      response.redirect('/article/category')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async categoryEdit({request, response, view, params}){
    const columnInfo = await Database.table('ni_article_categories').where('ni_id', params.id).first()

    const columnData = await Database.select('ni_id', 'column_name', 'parent_id').from('ni_article_categories')
    const formatData = await GlobalFn.soleTreeSort([...columnData])

    const formatSubData = await GlobalFn.findSubData([...columnData], columnInfo.ni_id)

    return view.render('article.category_edit', {columnInfo, columnData:formatData, subData:[].concat([columnInfo.ni_id], formatSubData)})
  }

  async categoryEditSave({request, response, view, params, session}){
    const saveData = await GlobalFn.formatSubmitData('ni_article_categories', request.all())

    try{
      await Database.table('ni_article_categories').where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('/article/category')
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

  async add({view}){
    return view.render('article.add')
  }


}

module.exports = ArticleController
