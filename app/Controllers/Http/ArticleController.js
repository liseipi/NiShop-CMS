'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Helpers = use('Helpers')
const Drive = use('Drive')

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

    return view.render('article.category_edit', {columnInfo, columnData:formatData, subData:formatSubData})
  }

  async categoryEditSave({request, response, params, session}){
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
      response.redirect('back')
    }
  }

  async add({view}){
    const categoryData = await Database.select('ni_id', 'parent_id', 'column_name').from('ni_article_categories')
    const formatData = await GlobalFn.soleTreeSort(categoryData)
    return view.render('article.add', {categoryData: formatData})
  }

  async addSave({request, response, session, auth}){
    const saveData = await GlobalFn.formatSubmitData('ni_articles', request.all())
    saveData.article_author = auth.user.ni_id
    saveData.create_at = new Date().getTime()

    //上传商品主图片
    const ThumbInfo =  await GlobalFn.uploadPic(request, 'thumb_img', {width:100, height:100, size:2})
    let imgMsg = ''
    if(ThumbInfo && ThumbInfo.status=='error'){
      imgMsg += '<p>图上传出错！Error: <pre><code>' + JSON.stringify(ThumbInfo.error) +'</code></pre></p>'
    }
    if(ThumbInfo && ThumbInfo.status=='moved'){
      saveData.thumb_img = ThumbInfo.fileName
      imgMsg += '<p>图上传成功。</p>'
    }

    try{
      console.log(saveData)
      await Database.from('ni_articles').insert(saveData)

      session.flash({notification: '增加成功！'+imgMsg})
      response.redirect('/article/list')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async list({view, request}){
    const query = request.get()
    const page = query.page || 1
    const perPage = 20
    const category_id = query.category || 0
    const keywords = query.keywords || ''

    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from('ni_article_categories')
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    const formatSubData = await GlobalFn.findSubData([...categoryData], category_id)
    let whereCategoty = []
    if(category_id!=0){
      whereCategoty = [].concat([parseInt(category_id)], formatSubData)
    }

    const articleData = await Database.select('ni_articles.*', 'ni_article_categories.column_name').from('ni_articles')
    .leftJoin('ni_article_categories', 'ni_articles.category_id', 'ni_article_categories.ni_id')
    .where(function(){
      if(category_id!=0){
        this.whereIn('ni_articles.category_id', whereCategoty)
      }
    })
    .where('ni_articles.article_title', 'like', `%${keywords}%`)
    .orderBy('ni_id', 'desc')
    .paginate(page, perPage)
    return view.render('article.list', {categoryData: formatData, articleData, query: query})
  }

  async edit({view, params}){
    const categoryData = await Database.select('ni_id', 'parent_id', 'column_name').from('ni_article_categories')
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    const articleInfo = await Database.select('*').from('ni_articles').where('ni_id', params.id).first()

    return view.render('article.edit', {categoryData: formatData, articleInfo})
  }

  async editSave({request, response, session, params}){
    const saveData = await GlobalFn.formatSubmitData('ni_articles', request.all())

    //上传商品主图片
    const ThumbInfo =  await GlobalFn.uploadPic(request, 'thumb_img', {width:100, height:100, size:2})
    let imgMsg = ''
    if(ThumbInfo && ThumbInfo.status=='error'){
      imgMsg += '<p>图上传出错！Error: <pre><code>' + JSON.stringify(ThumbInfo.error) +'</code></pre></p>'
    }
    if(ThumbInfo && ThumbInfo.status=='moved'){
      saveData.thumb_img = ThumbInfo.fileName
      imgMsg += '<p>图上传成功。</p>'

      const articlePic = await Database.table('ni_articles').select('thumb_img').where('ni_id', params.id).first()
      const oldPic = Helpers.appRoot('uploads/')+articlePic.thumb_img
      const exists = await Drive.exists(oldPic)
      if(exists){
        await Drive.delete(oldPic)
      }
    }

    try{
      await Database.table('ni_articles').where('ni_id', params.id).update(saveData)

      session.flash({notification: '修改成功！'})
      response.redirect('/article/list')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async destroy({response, params, session}){
    try{
      await Database.table('ni_articles').where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/article/list')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = ArticleController
