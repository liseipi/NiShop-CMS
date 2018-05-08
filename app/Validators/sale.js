'use strict'

class sale {
  get rules () {
    return {
      'sale_title': 'required',
      'sale_start_time': 'required',
      'sale_end_time': 'required',
    }
  }
  get messages(){
    return {
      'required': '这个 {{field}} 字段不为空.',
      'sale_start_time.required': '填写开始时间',
      'sale_end_time.required': '填写结束时间',
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = sale
