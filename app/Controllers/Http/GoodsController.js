'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Helpers = use('Helpers')
const Drive = use('Drive')

const categoryTable = 'ni_goods_categories'
const brandsTable = 'ni_brands'
const attrTable = 'ni_attrs'
const goodsTable = 'ni_goods'

class GoodsController {

  // 分类
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

  // 品牌
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
      await profilePic.move(Helpers.appRoot('uploads'), {
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
      await profilePic.move(Helpers.appRoot('uploads'), {
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
      const oldPic = Helpers.appRoot('uploads')+'/'+brandsInfo.brands_logo
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

  // 属性
  async attr({request, params, view}){
    const brandsData = await Database.select('ni_id', 'brands_name').from(brandsTable)
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    const query = request.get()
    const page = query.page || 1
    const perPage = 20
    const category_id = query.category || 0
    const brands_id = query.brands || 0
    const keywords = query.keywords || ''

    const formatSubData = await GlobalFn.findSubData([...categoryData], category_id)
    let whereCategoty = []
    if(category_id!=0){
      whereCategoty = [].concat([parseInt(category_id)], formatSubData)
    }

    const attrsData = await Database.select(attrTable+'.*', categoryTable+'.column_name', brandsTable+'.brands_name').from(attrTable)
      .leftJoin(categoryTable, attrTable+'.category_id', categoryTable+'.ni_id')
      .leftJoin(brandsTable, attrTable+'.brands_id', brandsTable+'.ni_id')
      .where(function(){
        if(category_id!=0){
          this.whereIn(attrTable+'.category_id', whereCategoty)
        }
      })
      .where(function(){
        if(brands_id!=0){
          this.where(attrTable+'.brands_id', '=', brands_id)
        }
      })
      .where(attrTable+'.attr_name', 'like', `%${keywords}%`)
      .paginate(page, perPage)

    return view.render('goods.attr', {brandsData, categoryData:formatData, attrsData, query: query})
  }

  async attrAdd({view}){
    const brandsData = await Database.select('ni_id', 'brands_name').from(brandsTable)
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    return view.render('goods.attr_add', {brandsData, categoryData:formatData})
  }

  async attrSave({request, response, session}){
    const saveData = await GlobalFn.formatSubmitData(attrTable, request.all())

    try{
      await Database.from(attrTable).insert(saveData)
      session.flash({notification: '增加成功！'})
      response.redirect('/goods/attr')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async attrEdit({view, params}){
    const attrInfo = await Database.table(attrTable).where('ni_id', params.id).first()
    const brandsData = await Database.select('ni_id', 'brands_name').from(brandsTable)
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    return view.render('goods.attr_edit', {attrInfo, brandsData, categoryData:formatData})
  }

  async attrEditSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(attrTable, request.all())

    try{
      await Database.table(attrTable).where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('/goods/attr')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async attrDestroy({response, params, session}){
    try{
      await Database.table(attrTable).where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/goods/attr')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

  // 商品
  async add({view}){
    const brandsData = await Database.select('ni_id', 'brands_name').from(brandsTable)
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    return view.render('goods.add', {brandsData, categoryData:formatData})
  }
}

module.exports = GoodsController
