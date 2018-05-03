'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

const brandsTable = 'ni_brands'
const categoryTable = 'ni_goods_categories'
const goodsTable = 'ni_goods'
const goodsGroupTable = 'ni_goods_groups'

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

    const goodsData = await Database.select(goodsTable+'.*', categoryTable+'.column_name', brandsTable+'.brands_name', Database.raw('group_concat("{group_id:", gt.ni_id, ", group_depict:", gt.group_depict, "}") as groupData'), Database.raw('(gt.ni_id) as testData')).from(goodsTable)
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
      //.toString()
      .paginate(page, perPage)

    return view.render('find.get_goods', {brandsData, categoryData:formatData, goodsData, query: query})
  }

}

module.exports = GetFindController
