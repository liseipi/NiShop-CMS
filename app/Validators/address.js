'use strict'

class address {
  get rules () {
    return {
      'username': 'required',
      'mobile': 'required',
      'address': 'required',
      'region_a': 'required|not_in:0',
      'region_b': 'required|not_in:0',
      'region_c': 'required|not_in:0',
      'region_d': 'required_if:needs_delivery|not_in:0',
    }
  }
  get messages(){
    return {
      'username.required': '请填写收货人.',
      'mobile.required': '请填写手机号.',
      'address.required': '请填写详细收货地址.',
      'region_a.required': '请选择省市.',
      'region_a.not_in': '请选择省市.',
      'region_b.required': '请选择市区.',
      'region_b.not_in': '请选择市区.',
      'region_c.required': '请选择乡镇.',
      'region_c.not_in': '请选择乡镇.',
      'region_d.required': '请选择街道.',
      'region_d.not_in': '请选择街道.'
    }
  }
  async fails (errorMessages){
    this.ctx.session.withErrors(errorMessages).flashAll()
    return this.ctx.response.redirect('back')
  }
}

module.exports = address
