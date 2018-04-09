'use strict'

class attr {
  get rules () {
    return {
      'attr_name': 'required',
      'brands_id': 'required',
      'category_id': 'required',
      'attr_only': 'required',
      'attr_type': 'required'
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = attr
