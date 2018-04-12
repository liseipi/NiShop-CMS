'use strict'

class goods {
  get rules () {
    return {
      'category_id': 'required|not_in:0',
      'goods_sku': 'required|unique:ni_goods|min:4',
      'goods_name': 'required|min:4',
      'brands_id': 'required|not_in:0'
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.',
      'category_id.not_in': '请选择商品分类.',
      'goods_sku.unique': '已经存在相同的sku',
      'min': '请至少输入4个字符.',
      'brands_id.not_in': '请选择对应的品牌.'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = goods
