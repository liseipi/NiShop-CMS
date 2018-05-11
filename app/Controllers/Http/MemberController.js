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

    if(saveData.email){
      await Mail.send('email.welcome', {}, (message) => {
        message.from('foo@bar.com')
        message.to('522371046@qq.com')
      })
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

  async cart({view, params}){

    const cartData = await Database.select(cartTable+'.*', goodsTable+'.goods_name', goodsTable+'.status', goodsTable+'.goods_instock', goodsTable+'.goods_price', goodsTable+'.goods_thumb', goodsGroupTable+'.group_depict', goodsGroupTable+'.group_price', goodsGroupTable+'.group_instock', goodsGroupTable+'.group_thumb', goodsGroupTable+'.group_status').from(cartTable)
      .leftJoin(goodsTable, cartTable+'.goods_id', goodsTable+'.ni_id')
      .leftJoin(goodsGroupTable, function () {
        this.on(goodsGroupTable+'.goods_id', '=', cartTable+'.goods_id').on(goodsGroupTable+'.ni_id', '=', cartTable+'.group_id')
      })
      .where('member_id', params.id)

    return view.render('member.cart', {cartData})

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
