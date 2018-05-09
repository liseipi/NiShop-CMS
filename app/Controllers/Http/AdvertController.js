'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Helpers = use('Helpers')
const Drive = use('Drive')

const advertTable = 'ni_adverts'
const advertPhotoTable = 'ni_advert_galleries'
const levelTable = 'ni_member_level'
const saleTable = 'ni_advert_sale'
const goodsTable = 'ni_goods'
const brandsTable = 'ni_brands'
const categoryTable = 'ni_goods_categories'

const moment = use('moment')

class AdvertController {

  async add({view}){
    return view.render('advert.add')
  }

  async addSave({request, response, session}){

    const saveData = await GlobalFn.formatSubmitData(advertTable, request.all())
    const query = request.all()
    let photoData = []
    //console.log(query)

    let advertMsg = '<p>广告增加成功。</p>'

    //处理轮播图片
    let carouselData = []
    let carouselThumbData = []
    if(query.ad_type==1){
      carouselData = request.collect(['advert_describe', 'advert_sort', 'advert_url'])
      const carousel_thumb = await GlobalFn.uploadMultiplePic(request, 'advert_images', {width:100, height:100, size:2})
      if(carousel_thumb){
        let errorThumbMsg = carousel_thumb.filter(item=>item.status=='error'&&item.error.clientName!='')
        if(errorThumbMsg.length>0){
          advertMsg += '<p>轮播图上传出错！Error: <pre><code>'+ JSON.stringify(errorThumbMsg) +'</code></pre></p>'
        }
        if(carousel_thumb.filter(item=>item.status=='error').length==0){
          advertMsg += '<p>轮播图上传成功。</p>'
        }
        carouselThumbData = carousel_thumb.map(item=>item.status=='moved'?item.fileName:'')
      }
      carouselData.forEach((item, index)=>{
        item.advert_images = carouselThumbData[index]
        item.pic_type = 1
        photoData.push(item)
      })
    }

    //处理全局广告图片
    let globalThumbData = []
    if(query.ad_type==2){
      const global_thumb = await GlobalFn.uploadMultiplePic(request, 'advert_images', {width:100, height:100, size:2})
      if(global_thumb){
        let errorThumbMsg = global_thumb.filter(item=>item.status=='error'&&item.error.clientName!='')
        if(errorThumbMsg.length>0){
          advertMsg += '<p>全局广告图上传出错！Error: <pre><code>'+ JSON.stringify(errorThumbMsg) +'</code></pre></p>'
        }
        if(global_thumb.filter(item=>item.status=='error').length==0){
          advertMsg += '<p>全局广告图上传成功。</p>'
        }
        globalThumbData = global_thumb.map(item=>item.status=='moved'?item.fileName:'')
      }
      globalThumbData.forEach((item, index)=>{
        photoData.push({
          advert_images: item,
          pic_type: index+3
        })
      })
    }

    //处理图文广告
    let photoThumbData = []
    if(query.ad_type==3){
      const photo_thumb =  await GlobalFn.uploadPic(request, 'advert_images', {width:100, height:100, size:2})
      if(photo_thumb && photo_thumb.status=='error'){
        advertMsg += '<p>图文广告主图上传出错！Error: <pre><code>' + JSON.stringify(goodsThumbInfo.error) +'</code></pre></p>'
      }
      if(photo_thumb && photo_thumb.status=='moved'){
        photoThumbData.push(photo_thumb.fileName)
        advertMsg += '<p>图文广告主图上传成功。</p>'
      }
      photoData.push({
        advert_images: photoThumbData[0],
        pic_type: 2
      })
    }

    try{
      const advertID = await Database.from(advertTable).insert(saveData)
      let newPhoto = photoData.map(item=>{
        item.advert_id = advertID[0]
        return item
      })

      try{
        await Database.from(advertPhotoTable).insert(newPhoto)
        advertMsg += '<p>图片信息保存成功。</p>'
      }catch(error){
        advertMsg += '<p>图片信息保存失败！'+error +'</p>'
      }

      session.flash({notification: advertMsg})
      response.redirect('/advert/list')
    }catch (error) {
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }

  }

  async list({view}){
    const advertData = await Database.select('*').from(advertTable)
    return view.render('advert.list', {advertData})
  }

  async edit({view, params}){
    const advertInfo = await Database.table(advertTable).where('ni_id', params.id).first()
    const photoData = await Database.select('*').from(advertPhotoTable).where('advert_id', advertInfo.ni_id)
    return view.render('advert.edit', {advertInfo, photoData})
  }

  async editSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(advertTable, request.all())
    const query = request.all()
    let photoData = []

    let advertMsg = '<p>广告编辑成功。</p>'

    //处理轮播图片
    let carouselData = []
    let carouselThumbData = []
    if(query.ad_type==1){
      carouselData = request.collect(['advert_ni_id', 'advert_describe', 'advert_sort', 'advert_url', 'advert_old_thumb'])
      const carousel_thumb = await GlobalFn.uploadMultiplePic(request, 'advert_images', {width:100, height:100, size:2})
      if(carousel_thumb){
        let errorThumbMsg = carousel_thumb.filter(item=>item.status=='error'&&item.error.clientName!='')
        if(errorThumbMsg.length>0){
          advertMsg += '<p>轮播图上传出错！Error: <pre><code>'+ JSON.stringify(errorThumbMsg) +'</code></pre></p>'
        }
        if(carousel_thumb.filter(item=>item.status=='error').length==0){
          advertMsg += '<p>轮播图上传成功。</p>'
        }
        carouselThumbData = carousel_thumb.map(item=>item.status=='moved'?item.fileName:'')
      }
      carouselData.forEach((item, index)=>{
        if(carouselThumbData[index]){
          item.advert_images = carouselThumbData[index]
        }else{
          item.advert_images = item.advert_old_thumb
        }
        item.pic_type = 1
        item.advert_id = params.id
        if(item.advert_ni_id){
          item.ni_id = item.advert_ni_id
        }
        delete item.advert_ni_id
        delete item.advert_old_thumb
        photoData.push(item)
      })
    }

    //处理全局广告图片
    let globalThumbData = []
    if(query.ad_type==2){
      const global_thumb = await GlobalFn.uploadMultiplePic(request, 'advert_images', {width:100, height:100, size:2})
      if(global_thumb){
        let errorThumbMsg = global_thumb.filter(item=>item.status=='error'&&item.error.clientName!='')
        if(errorThumbMsg.length>0){
          advertMsg += '<p>全局广告图上传出错！Error: <pre><code>'+ JSON.stringify(errorThumbMsg) +'</code></pre></p>'
        }
        if(global_thumb.filter(item=>item.status=='error').length==0){
          advertMsg += '<p>全局广告图上传成功。</p>'
        }
        globalThumbData = global_thumb.map(item=>item.status=='moved'?item.fileName:'')
      }
      globalThumbData.forEach((item, index)=>{
        photoData.push({
          advert_images: item||query.advert_old_thumb[index],
          ni_id: query.advert_ni_id[index],
          pic_type: index+3,
          advert_id: params.id
        })
      })
    }

    //处理图文广告
    let photoThumbData = []
    if(query.ad_type==3){
      const photo_thumb =  await GlobalFn.uploadPic(request, 'advert_images', {width:100, height:100, size:2})
      if(photo_thumb && photo_thumb.status=='error'){
        advertMsg += '<p>图文广告主图上传出错！Error: <pre><code>' + JSON.stringify(goodsThumbInfo.error) +'</code></pre></p>'
      }
      if(photo_thumb && photo_thumb.status=='moved'){
        photoThumbData.push(photo_thumb.fileName)
        advertMsg += '<p>图文广告主图上传成功。</p>'
      }
      photoData.push({
        advert_images: photoThumbData[0]||query.advert_old_thumb,
        ni_id: query.advert_ni_id,
        pic_type: 2,
        advert_id: params.id
      })
    }

    try{
      await Database.from(advertTable).where('ni_id', params.id).update(saveData)

      try{
        const insert = Database.table(advertPhotoTable).insert(photoData).toString()
        await Database.schema.raw(insert + ` ON DUPLICATE KEY UPDATE advert_id=VALUES(advert_id), advert_images=VALUES(advert_images), advert_url=VALUES(advert_url), advert_describe=VALUES(advert_describe), advert_sort=VALUES(advert_sort), pic_type=VALUES(pic_type)`)
        advertMsg += '<p>图片信息保存成功。</p>'
      }catch(error){
        advertMsg += '<p>图片信息保存失败！'+ error +'</p>'
      }

      session.flash({notification: advertMsg})
      response.redirect('/advert/list')
    }catch(error){
      session.flash({notification: '修改失败！'+error})
      response.redirect('back')
    }

  }

  async destroy({response, params, session}){
    let delMsg = `<p>删除广告成功。</>`
    try{
      await Database.table(advertTable).where('ni_id', params.id).delete()

      const adPics = await Database.select('advert_images').table(advertPhotoTable).where('advert_id', params.id)
      adPics.forEach(item=>{
        if(item.advert_images){
          const oldPic = Helpers.appRoot('uploads/')+item.advert_images
          const exists = Drive.exists(oldPic)
          if(exists){
            Drive.delete(oldPic)
          }
        }
      })

      //删除属性
      try{
        await Database.table(advertPhotoTable).where('advert_id', params.id).delete()
        delMsg += `<p>删除图片信息成功。</>`
      }catch (e) {
        delMsg += `<p>删除图片信息失败！</>`
      }

      session.flash({notification: delMsg})
      response.redirect('/advert/list')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

  async delAdvertPhoto({view, request}){
    const query = request.get()
    const niID = query.ni_id
    const adData = await Database.table(advertPhotoTable).where('ni_id', niID).first()
    const adThumb = adData.group_thumb
    if(adThumb){
      const oldPic = Helpers.appRoot('uploads')+'/'+adThumb
      const exists = await Drive.exists(oldPic)
      if(exists){
        await Drive.delete(oldPic)
      }
    }

    try{
      await Database.table(advertPhotoTable).where('ni_id', niID).delete()
      return [{status: 0}]
    }catch(error) {
      return [{status: 1}]
    }
  }

  async saleAdd({view}){
    const levelData = await Database.select('*').from(levelTable)
    return view.render('advert.sale_add', {
      levelData,
      date: {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(1, 'year').format('YYYY-MM-DD')
      }
    })
  }

  async saleAddSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(saleTable, request.all())
    saveData.sale_start_time = new Date(saveData.sale_start_time).getTime()
    saveData.sale_end_time = new Date(saveData.sale_end_time).getTime()

    if(saveData.sale_start_time >= saveData.sale_end_time){
      session.flash({notification: '开始时间不大于或等于结束时间！'})
      session.withErrors().flashAll()
      return response.redirect('back')
    }

    if(saveData.sale_type==1 && !saveData.type_value1){
      session.flash({notification: '缺少优惠赠品！'})
      session.withErrors().flashAll()
      return response.redirect('back')
    }

    if(saveData.sale_offerScope==3 && !saveData.offerScope_value3){
      session.flash({notification: '缺少优惠商品！'})
      session.withErrors().flashAll()
      return response.redirect('back')
    }

    if(saveData.sale_offerScope==3 && saveData.offerScope_value3){
      saveData.offerScope_value3 = saveData.offerScope_value3.join(',')
    }

    try{
      await Database.table(saleTable).insert(saveData)

      session.flash({notification: '增加成功！'})
      response.redirect('/advert/saleList')
    }catch(error){
      session.flash({notification: '增加失败！'+error})
      response.redirect('back')
    }
  }

  async saleList({view}){
    const saleData = await Database.select('*').from(saleTable)
    return view.render('advert.sale_list', {saleData})
  }

  async saleEdit({view, params}){
    const saleInfo = await Database.table(saleTable).where('ni_id', params.id).first()
    const levelData = await Database.select('*').from(levelTable)

    //返回赠品
    if(saleInfo.sale_type==1 && saleInfo.type_value1){
      const gifts = await Database.select('ni_id', 'goods_name', 'goods_thumb').table(goodsTable).where('ni_id', saleInfo.type_value1).first()
      saleInfo.giftsGoods = gifts
    }

    //返回品牌
    if(saleInfo.sale_offerScope==1 && saleInfo.offerScope_value1){
      const brandsInfo = await Database.select('ni_id', 'brands_name', 'brands_logo').table(brandsTable).where('ni_id', saleInfo.offerScope_value1).first()
      saleInfo.brandsInfo = brandsInfo
    }

    //返回分类
    if(saleInfo.sale_offerScope==2 && saleInfo.offerScope_value2){
      const categoryInfo = await Database.select('ni_id', 'column_name').table(categoryTable).where('ni_id', saleInfo.offerScope_value2).first()
      saleInfo.categoryInfo = categoryInfo
    }

    //返回优惠的商品
    if(saleInfo.sale_offerScope==3 && saleInfo.offerScope_value3){
      const offerGoods = await Database.select('ni_id', 'goods_name', 'goods_thumb').from(goodsTable).whereIn('ni_id', saleInfo.offerScope_value3.split(','))
      saleInfo.offerGoods = offerGoods
    }

    return view.render('advert.sale_edit', {
      saleInfo,
      levelData,
      date: {
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().add(1, 'year').format('YYYY-MM-DD')
      }
    })
  }

  async saleEditSave({request, response, params, session}){
    const saveData = await GlobalFn.formatSubmitData(saleTable, request.all())
    saveData.sale_start_time = new Date(saveData.sale_start_time).getTime()
    saveData.sale_end_time = new Date(saveData.sale_end_time).getTime()

    if(saveData.sale_start_time >= saveData.sale_end_time){
      session.flash({notification: '开始时间不大于或等于结束时间！'})
      session.withErrors().flashAll()
      return response.redirect('back')
    }

    if(saveData.sale_type==1 && !saveData.type_value1){
      session.flash({notification: '缺少优惠赠品！'})
      session.withErrors().flashAll()
      return response.redirect('back')
    }

    if(saveData.sale_offerScope==3 && !saveData.offerScope_value3){
      session.flash({notification: '缺少优惠商品！'})
      session.withErrors().flashAll()
      return response.redirect('back')
    }

    if(saveData.sale_offerScope==3 && saveData.offerScope_value3){
      saveData.offerScope_value3 = saveData.offerScope_value3.join(',')
    }

    try{
      await Database.from(saleTable).where('ni_id', params.id).update(saveData)

      session.flash({notification: '编辑成功！'})
      response.redirect('/advert/saleList')
    }catch(error){
      session.flash({notification: '编辑失败！'+error})
      response.redirect('back')
    }
  }

  async saleDestroy({response, params, session}){
    try{
      await Database.table(saleTable).where('ni_id', params.id).delete()

      session.flash({notification: '删除成功！'})
      response.redirect('/advert/saleList')
    }catch(error){
      session.flash({notification: '删除失败！'+error})
      response.redirect('back')
    }
  }

}

module.exports = AdvertController
