'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Helpers = use('Helpers')
const Drive = use('Drive')

const categoryTable = 'ni_goods_categories'
const brandsTable = 'ni_brands'
const attrTable = 'ni_attrs'
const goodsTable = 'ni_goods'
const goodsAttrTable = 'ni_goods_attrs'
const goodsGroupTable = 'ni_goods_groups'

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
      //console.log(oldPic)
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

  async getAttr({view, request}){
    const query = request.get()
    const category_id = query.category || 0
    const brands_id = query.brands || 0

    if(category_id==0 || brands_id==0) {
      return []
    }

    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatSubData = await GlobalFn.findSubData([...categoryData], category_id)
    let whereCategoty = []
    if(category_id!=0){
      whereCategoty = [].concat([parseInt(category_id)], formatSubData)
    }

    const attrsData = await Database.select("*").from(attrTable)
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

    return attrsData
  }

  // 商品
  async add({view}){
    const brandsData = await Database.select('ni_id', 'brands_name').from(brandsTable)
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id', 'column_sku').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    return view.render('goods.add', {brandsData, categoryData:formatData})
  }

  async addSave({view, request, response, session, auth}){

    const saveData = await GlobalFn.formatSubmitData(goodsTable, request.all())
    const query = request.all()
    //console.log(query)

    saveData.goods_is_new = 1
    saveData.goods_is_hot = 1
    saveData.goods_is_best = 1
    saveData.goods_is_promotions = 1
    saveData.goods_is_group = 1
    saveData.goods_is_real = 1

    if(query.goods_recommend){
      if((typeof query.goods_recommend) === 'string'){
        // 单个值
        switch (query.goods_recommend){
          case 'new':
            saveData.goods_is_new = 0
            break;
          case 'hot':
            saveData.goods_is_hot = 0
            break;
          case 'best':
            saveData.goods_is_best = 0
            break;
          case 'promotions':
            saveData.goods_is_promotions = 0
            break;
          default:
        }
      }
      if((typeof query.goods_recommend) === 'object'){
        // 多个值
        if(query.goods_recommend.indexOf('new')>=0){
          saveData.goods_is_new = 0
        }
        if(query.goods_recommend.indexOf('hot')>=0){
          saveData.goods_is_hot = 0
        }
        if(query.goods_recommend.indexOf('best')>=0){
          saveData.goods_is_best = 0
        }
        if(query.goods_recommend.indexOf('promotions')>=0){
          saveData.goods_is_promotions = 0
        }
      }
    }

    if(query.goods_is_group){
      saveData.goods_is_group = 0
    }

    if(query.goods_is_real){
      saveData.goods_is_real = 0
    }

    let goodsMsg = '<p>商品增加成功。</p>'

    //上传商品主图片
    const goodsThumbInfo =  await GlobalFn.uploadPic(request, 'goods_thumb', {width:100, height:100, size:2})
    if(goodsThumbInfo && goodsThumbInfo.status=='error'){
      goodsMsg += '<p>商品主图上传出错！Error: <pre><code>' + JSON.stringify(goodsThumbInfo.error) +'</code></pre></p>'
    }
    if(goodsThumbInfo && goodsThumbInfo.status=='moved'){
      saveData.goods_thumb = goodsThumbInfo.fileName
      goodsMsg += '<p>商品主图上传成功。</p>'
    }

    //处理组商品和组图片信息
    let groupGoodsData = []
    let groupThumbData = []
    if(query.group_depict){
      groupGoodsData = request.collect(['group_depict', 'group_price', 'group_instock', 'group_status'])
      const groupGoods_thumb =  await GlobalFn.uploadMultiplePic(request, 'group_thumb', {width:100, height:100, size:2})
      if(groupGoods_thumb){
        let errorThumbMsg = groupGoods_thumb.filter(item=>item.status=='error'&&item.error.clientName!='')
        if(errorThumbMsg.length>0){
          goodsMsg += '<p>组产品图上传出错！Error: <pre><code>'+ JSON.stringify(errorThumbMsg) +'</code></pre></p>'
        }
        if(groupGoods_thumb.filter(item=>item.status=='error').length==0){
          goodsMsg += '<p>组产品图上传成功。</p>'
        }
        groupThumbData = groupGoods_thumb.map(item=>item.status=='moved'?item.fileName:'')
      }
    }

    //处理属性信息
    let attrsData = []
    if(query.goods_attr_value){
      request._qs = {category: query.category_id, brands: query.brands_id}  //模拟传参
      const attrIdData = await this.getAttr({view, request})
      let attrId = []
      attrIdData.forEach(item=>attrId.push(item.ni_id))
      query.attr_id = attrId
      attrsData = request.collect(['goods_attr_value', 'attr_id'])
    }

    saveData.created_at = new Date()
    saveData.updated_at = new Date()
    saveData.goods_created_admin = auth.user.ni_id

    //console.log(saveData)
    //return

    try{
      const goodID = await Database.from(goodsTable).insert(saveData)

      //保存组商品信息
      if(groupGoodsData.length>0){
        let newGroupData =  groupGoodsData.map((item, index)=>{
          item.goods_id = goodID[0]
          item.group_thumb = groupThumbData[index]||''
          return item
        })
        if(newGroupData.length>0){
          try{
            await Database.from(goodsGroupTable).insert(newGroupData)
            goodsMsg += '<p>组商品信息保存成功。</p>'
          }catch(error){
            goodsMsg += '<p>组商品信息保存失败！'+ error +'</p>'
          }
        }
      }

      //保存属性
      if(attrsData){
        let attrs = []
        attrsData.forEach(item=>{
          item.goods_id=goodID[0]
          attrs.push(item)
        })
        let newAttrs = attrs.filter(item=>item.goods_attr_value)
        if(newAttrs.length>0){
          try{
            await Database.from(goodsAttrTable).insert(newAttrs)
            goodsMsg += '<p>商品属性保存成功。</p>'
          }catch(error){
            goodsMsg += '<p>商品属性保存失败！'+error +'</p>'
          }
        }
      }

      session.flash({notification: goodsMsg})
      response.redirect('/goods/list')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }

  }

  async list({view, request}){
    const brandsData = await Database.select('ni_id', 'brands_name').from(brandsTable)
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    const query = request.get()
    const page = query.page || 1
    const perPage = 20
    const category_id = query.category || 0
    const brands_id = query.brands || 0
    const attrs = query.attr || 'all'
    console.log(attrs)
    const keywords = query.keywords || ''

    const formatSubData = await GlobalFn.findSubData([...categoryData], category_id)
    let whereCategoty = []
    if(category_id!=0){
      whereCategoty = [].concat([parseInt(category_id)], formatSubData)
    }

    const goodsData = await Database.select(goodsTable+'.*', categoryTable+'.column_name', brandsTable+'.brands_name').from(goodsTable)
      .leftJoin(categoryTable, goodsTable+'.category_id', categoryTable+'.ni_id')
      .leftJoin(brandsTable, goodsTable+'.brands_id', brandsTable+'.ni_id')
      .where(function(){
        if(category_id!=0){
          this.whereIn(goodsTable+'.category_id', whereCategoty)
        }
      })
      .where(function(){
        if(brands_id!=0){
          this.where(goodsTable+'.brands_id', '=', brands_id)
        }
      })
      .where(function(){
        if(attrs=='id'){
          this.where(goodsTable+'.ni_id', '=', keywords)
        }
        if(attrs=='sku'){
          this.where(goodsTable+'.goods_sku', '=', keywords)
        }
        if(attrs=='name'){
          this.where(goodsTable+'.goods_name', 'like', `%${keywords}%`)
        }
      })
      .paginate(page, perPage)

    return view.render('goods.list', {brandsData, categoryData:formatData, goodsData, query: query})
  }

  async checkSku({request}){
    const query = request.get()
    const sku = query.sku || ''
    const attrInfo = await Database.select('ni_id').table(goodsTable).where('goods_sku', sku).first()
    if(attrInfo){
      return [attrInfo.ni_id]
    }
    return []
  }
}

module.exports = GoodsController
