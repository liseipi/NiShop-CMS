'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

const brandsTable = 'ni_brands'
const categoryTable = 'ni_goods_categories'
const goodsTable = 'ni_goods'
const goodsGroupTable = 'ni_goods_groups'
const memberTable = 'ni_member'

class GetFindController {

  async getBrands({view, request}){
    const query = request.get()
    const page = query.page || 1
    const perPage = 20
    const keywords = query.keywords || ''
    const brandsData = await Database.select('ni_id', 'brands_logo', 'status', 'brands_name').from(brandsTable)
      .where('brands_name', 'like', `%${keywords}%`)
      .where('status', 0).paginate(page, perPage)
    return view.render('find.get_brands', {brandsData, query})
  }

  async getCategory({view, request}){
    const query = request.get()
    const categoryData = await Database.select('*').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)
    return view.render('find.get_category', {categoryData: formatData, query})
  }

  async getGoods({view, request}){
    const brandsData = await Database.select('ni_id', 'brands_name').from(brandsTable)
    const categoryData = await Database.select('ni_id', 'column_name', 'parent_id').from(categoryTable)
    const formatData = await GlobalFn.soleTreeSort(categoryData)

    const query = request.get()
    const page = query.page || 1
    const perPage = 20
    const category_id = query.category || 0
    const brands_id = query.brands || 0
    const attrs = query.attr || 'all'
    const keywords = query.keywords || ''

    const formatSubData = await GlobalFn.findSubData([...categoryData], category_id)
    let whereCategoty = []
    if(category_id!=0){
      whereCategoty = [].concat([parseInt(category_id)], formatSubData)
    }

    const count = await Database.from(goodsTable).count()

    const goodsData = await Database.select(goodsTable+'.*', categoryTable+'.column_name', brandsTable+'.brands_name', Database.raw('group_concat("{\'groupId\': ", gt.ni_id, ", \'groupDepict\': \'", gt.group_depict, "\', \'groupPic\': \'", gt.group_thumb, "\'}") as groupData')).from(goodsTable)
      .leftJoin(categoryTable, goodsTable+'.category_id', categoryTable+'.ni_id')
      .leftJoin(goodsGroupTable+' as gt', 'gt.goods_id', goodsTable+'.ni_id')
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
      .groupBy(goodsTable+'.ni_id')
      .orderBy(goodsTable+'.ni_id', 'desc')
      .paginate(page, perPage)

    goodsData.total = count[0]['count(*)']
    goodsData.lastPage = Math.ceil(count[0]['count(*)']/perPage)

    goodsData.data.forEach((item, index)=>{
      if(item.groupData){
        item.groupData = JSON.parse('['+(item.groupData.replace(/\'/g, '"'))+']')
      }
    })

    return view.render('find.get_goods', {brandsData, categoryData:formatData, goodsData, query: query})
  }

  async getMember({view, request}){
    const query = request.get()
    const page = query.page || 1
    const perPage = 20
    const typeValue = query.type || 0
    const keywords = query.keywords || ''

    const memberData = await Database.select('ni_id', 'username', 'mobile', 'email', 'is_verify_mobile', 'is_verify_email').from(memberTable)
      .where(function(){
        if(typeValue!=0){
          this.where(memberTable+'.'+typeValue, 'like', `%${keywords}%`)
        }
      })
      .orderBy('ni_id', 'desc')
      .paginate(page, perPage)

    return view.render('find.get_member', {memberData, query: query})
  }

}

module.exports = GetFindController
