'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Mail = use('Mail')

const memberTable = 'ni_member'
const addressTable = 'ni_member_address'
const regionTable = 'ni_region'
const cartTable = 'ni_member_cart'
const goodsTable = 'ni_goods'
const goodsGroupTable = 'ni_goods_groups'
const levelTable = 'ni_member_level'

class MemberController {

  async list({view, request}){

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

    return view.render('member.list', {memberData, query: query})
  }

  async add({view}){
    return view.render('member.add')
  }

  async addSave({request, response, params, session}){
    console.log(request.all())
    const saveData = await GlobalFn.formatSubmitData(memberTable, request.all())

    try{
      await Database.table(memberTable).insert(saveData)

      if(saveData.email){
        Mail.send('email.welcome', {}, (message) => {
          message.from('yaowen1998@gmail.com')
          message.to(saveData.email)
        })
      }

      session.flash({notification: '增加成功！'})
      response.redirect('/member/list')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }

  }

  async edit({view, params}){
    const memberInfo = await Database.select('*').from(memberTable).where('ni_id', params.id).first()

    const addressData = await Database.select(addressTable+'.*', 'a.region_name as region_a_name', 'b.region_name as region_b_name', 'c.region_name as region_c_name', 'd.region_name as region_d_name').from(addressTable)
      .joinRaw(`left join ${regionTable} a on a.ni_id=${addressTable}.region_a`)
      .joinRaw(`left join ${regionTable} b on b.ni_id=${addressTable}.region_b`)
      .joinRaw(`left join ${regionTable} c on c.ni_id=${addressTable}.region_c`)
      .joinRaw(`left join ${regionTable} d on d.ni_id=${addressTable}.region_d`)
      .where('member_id', params.id)

    return view.render('member.edit', {memberInfo, addressData})
  }

  async editSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(memberTable, request.all())
    if(!request.all().status){
      saveData.status = 0
    }

    try{
      await Database.table(memberTable).where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('back')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async destroy({response, params, session}){

    session.flash({notification: '暂不支持删除用户操作！'})
    return response.redirect('back')
    /*
    try{
      await Database.table(levelTable).where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/member/level')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
    */
  }

  async addressNew({view, params}){
    return view.render('member.address_add', {member_id: params.id})
  }

  async addressNewSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(addressTable, request.all())
    saveData.member_id = params.id

    const count = await Database.from(addressTable).where({member_id: params.id}).count()
    const total = count[0]['count(*)']

    if(total<=20){
      try{
        await Database.table(addressTable).insert(saveData)

        session.flash({notification: '增加成功！'})
        response.redirect('/member/edit/'+params.id)
      }catch(error){
        session.flash({notification: '增加失败！'+error})
        response.redirect('back')
      }
    }else{
      session.flash({notification: '增加失败！当前用户能创建20条地址.'})
      response.redirect('back')
    }
  }

  async addressEdit({view, params}){
    const addressInfo = await Database.from(addressTable).where('ni_id', params.id).first()
    return view.render('member.address_edit', {addressInfo})
  }

  async addressEditSave({request, response, params, session}){
    const addressInfo = await Database.from(addressTable).where('ni_id', params.id).first()
    const saveData = await GlobalFn.formatSubmitData(addressTable, request.all())

    try{
      await Database.table(addressTable).where('ni_id', params.id).update(saveData)

      session.flash({notification: '修改成功！'})
      response.redirect('/member/edit/'+addressInfo.member_id)
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async addressDestroy({response, params, session}){
    const addressInfo = await Database.from(addressTable).where('ni_id', params.id).first()

    try{
      await Database.table(addressTable).where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/member/edit/'+addressInfo.member_id)
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

  async getRegion({request}){
    const query = request.get()
    const pid = query.parendId
    if(pid){
      const regionData = await Database.select('*').from(regionTable).where('parent_id', pid)
      if(regionData){
        return regionData
      }else{
        return
      }
    }else{
      return []
    }
  }

  async cart({view, params}){

    const cartData = await Database.select(cartTable+'.*', goodsTable+'.goods_name', goodsTable+'.goods_sku', goodsTable+'.status', goodsTable+'.goods_instock', goodsTable+'.goods_price', goodsTable+'.goods_thumb', goodsGroupTable+'.group_depict', goodsGroupTable+'.group_price', goodsGroupTable+'.group_instock', goodsGroupTable+'.group_thumb', goodsGroupTable+'.group_status').from(cartTable)
      .leftJoin(goodsTable, cartTable+'.goods_id', goodsTable+'.ni_id')
      .leftJoin(goodsGroupTable, function () {
        this.on(goodsGroupTable+'.goods_id', '=', cartTable+'.goods_id').on(goodsGroupTable+'.ni_id', '=', cartTable+'.group_id')
      })
      .where('member_id', params.id)
      .orderBy('ni_id', 'desc')

    return view.render('member.cart', {cartData, member_id: params.id})

  }

  async cartSave({request, response, params, session}){
    const body = request.collect(['ni_id', 'goods_id', 'is_select', 'quantity', 'group_id'])
    body.forEach(item=>item.member_id = params.id)
    const cartData = await Database.select('ni_id', 'member_id', 'goods_id', 'is_select', 'quantity', 'goods_is_group', 'group_id').from(cartTable).where('member_id', params.id)

    /* 分析增删改 */
    //分析增
    const newData = body.filter(item => {
      return cartData.every(oldItem => {
        return !(item.member_id==oldItem.member_id && item.goods_id==oldItem.goods_id)
      })
    })

    //分析改
    const editData = body.filter(item => {
      return cartData.some(oldItem => {
        //return item.member_id==oldItem.member_id && item.goods_id==oldItem.goods_id
        return item.member_id==oldItem.member_id && item.goods_id==oldItem.goods_id && (item.is_select!=oldItem.is_select || item.quantity!=oldItem.quantity)
      })
    })

    //分析删除
    const delData = cartData.filter(item => {
      return body.every(oldItem => {
        return !(item.member_id==oldItem.member_id && item.goods_id==oldItem.goods_id)
      })
    })

    /*---------------*/
    //存储增删改
    //存储新增
    let newMsg = ''
    if(newData.length>0){
      let NewIds = newData.map(item=>item.goods_id)
      let goodsIsGroup = await Database.select('goods_is_group').from(goodsTable).whereIn('ni_id', NewIds)
      newData.forEach((item, index)=>{
        Object.assign(item, goodsIsGroup[index])
      })
      const checkNewData = newData.filter(item=>{
        let flag = false
        if(item.goods_is_group==0 && item.group_id){
          flag = true
        }
        if(item.goods_is_group==1){
          flag = true
        }
        return flag
      })
      if(newData.length!=checkNewData.length){
        newMsg = '增加部分商品出错，请检查对应的子商品。'
      }
      let saveNewData = checkNewData.map(item=>{
        delete item.ni_id
        item.create_at = new Date().getTime()
        return item
      })

      if(saveNewData.length>0){
        try{
          await Database.table(cartTable).insert(saveNewData)
        }catch(error){
          newMsg += '增加出错. '
        }
      }
    }

    //存储修改
    let editMsg = ''
    if(editData.length>0){
      let saveEditData = editData.map(item=>{
        delete item.goods_id
        delete item.group_id
        delete item.member_id
        return item
      })
      if(saveEditData.length>0){
        try{
          const insert = Database.table(cartTable).insert(saveEditData).toString()
          await Database.schema.raw(insert + ` ON DUPLICATE KEY UPDATE is_select=VALUES(is_select), quantity=VALUES(quantity)`)
        }catch(error){
          editMsg = '编辑失败.'+error
        }
      }

    }

    //存储删除
    let delMsg = ''
    if(delData.length>0){
      let saveDelData = delData.map(item=>item.ni_id)
      try{
        await Database.table(cartTable).whereIn('ni_id', saveDelData).delete()
      }catch(error){
        delMsg = '删除失败.'
      }
    }

    if(newMsg!='' || editMsg!='' || delMsg!=''){
      session.flash({notification: newMsg + editMsg + delMsg})
    }
    return response.redirect('/member/cart/'+ params.id)
  }

  async levelAdd({view}){
    return view.render('member.level_add')
  }

  async levelAddSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(levelTable, request.all())

    try{
      await Database.table(levelTable).insert(saveData)
      session.flash({notification: '增加成功！'})
      response.redirect('/member/level')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async level({view}){
    const levelData = await Database.select('*').from(levelTable)
    return view.render('member.level', {levelData})
  }

  async levelEdit({view, params}){
    const levelInfo = await Database.table(levelTable).where('ni_id', params.id).first()
    return view.render('member.level_edit', {levelInfo})
  }

  async levelEditSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(levelTable, request.all())

    try{
      await Database.table(levelTable).where('ni_id', params.id).update(saveData)
      session.flash({notification: '修改成功！'})
      response.redirect('/member/level')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }
  }

  async levelDestroy({response, params, session}){

    try{
      await Database.table(levelTable).where('ni_id', params.id).delete()
      session.flash({notification: '删除成功！'})
      response.redirect('/member/level')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = MemberController
