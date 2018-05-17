'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')

const addressTable = 'ni_member_address'
const regionTable = 'ni_region'
const cartTable = 'ni_member_cart'
const goodsTable = 'ni_goods'
const goodsGroupTable = 'ni_goods_groups'

class OrderController {

  async add({view, params}){
    const addressData = await Database.select(addressTable+'.*', 'a.region_name as region_a_name', 'b.region_name as region_b_name', 'c.region_name as region_c_name', 'd.region_name as region_d_name').from(addressTable)
      .joinRaw(`left join ${regionTable} a on a.ni_id=${addressTable}.region_a`)
      .joinRaw(`left join ${regionTable} b on b.ni_id=${addressTable}.region_b`)
      .joinRaw(`left join ${regionTable} c on c.ni_id=${addressTable}.region_c`)
      .joinRaw(`left join ${regionTable} d on d.ni_id=${addressTable}.region_d`)
      .where('member_id', params.id)
    addressData.forEach(item=>{
      item.is_select = item.default==1?1:0;
      item.mobile = item.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    })

    const cartData = await Database.select(cartTable+'.*', goodsTable+'.goods_name', goodsTable+'.goods_weight', goodsTable+'.status', goodsTable+'.goods_instock', goodsTable+'.goods_price', goodsTable+'.goods_thumb', goodsGroupTable+'.group_depict', goodsGroupTable+'.group_price', goodsGroupTable+'.group_instock', goodsGroupTable+'.group_thumb', goodsGroupTable+'.group_status').from(cartTable)
      .leftJoin(goodsTable, cartTable+'.goods_id', goodsTable+'.ni_id')
      .leftJoin(goodsGroupTable, function () {
        this.on(goodsGroupTable+'.goods_id', '=', cartTable+'.goods_id').on(goodsGroupTable+'.ni_id', '=', cartTable+'.group_id')
      })
      .where(cartTable+'.member_id', params.id)
      .where(cartTable+'.is_select', 1)
      .orderBy(cartTable+'.ni_id', 'desc')

    let newCartData = cartData.filter(item=>{
      if(item.goods_is_group==0){
        if((item.status==0 && item.group_status==0) && (item.group_instock>0 && item.quantity<=item.group_instock)){
          return item
        }
      }else{
        if(item.status==0 && (item.instock>0 && item.quantity<=item.instock)){
          return item
        }
      }
    })
    if(newCartData.length>0){
      newCartData.forEach(item=>{
        delete item.create_at
        if(item.goods_is_group==0){
          item.instock = item.group_instock
          item.price = item.group_price
          item.thumb = item.group_thumb
        }else{
          item.instock = item.goods_instock
          item.price = item.goods_price
          item.thumb = item.goods_thumb
        }
        delete item.group_instock
        delete item.group_price
        delete item.group_thumb
        delete item.goods_instock
        delete item.goods_price
        delete item.goods_thumb
      })
    }

    return view.render('order.add', {addressData, newCartData})
  }

}

module.exports = OrderController
