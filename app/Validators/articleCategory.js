'use strict'

class articleCategory {
  get rules () {
    return {
      'parent_id': 'required',
      'column_name': 'required',
      'controller': 'required'
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

module.exports = articleCategory
