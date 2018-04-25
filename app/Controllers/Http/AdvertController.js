'use strict'

const Database = use('Database')
const GlobalFn = use('App/Helpers/GlobalFn')
const Helpers = use('Helpers')
const Drive = use('Drive')

const advertTable = 'ni_adverts'
const advertPhotoTable = 'ni_advert_galleries'

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
    if(query.ad_type==0){
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
    if(query.ad_type==1){
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
    if(query.ad_type==2){
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

}

module.exports = AdvertController
