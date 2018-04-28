'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.on('/test').render('test')

Route.on('/login').render('auth.login')
Route.post('/login', 'AuthController.signIn')
Route.get('/logout', async ({auth, response})=>{
  await auth.logout()
  return response.redirect('/')
})

Route.group(()=>{

  Route.get('/', 'HomeController.store')
  Route.get('/dashboard', 'HomeController.dashboard')

  Route.get('/menu/add', 'MenuController.add')
  Route.post('/menu/add', 'MenuController.addSave').validator('menu')
  Route.get('/menu/list', 'MenuController.list')
  Route.get('/menu/edit/:id', 'MenuController.edit')
  Route.post('/menu/edit/:id', 'MenuController.editSave').validator('menu')
  Route.get('/menu/destroy/:id', 'MenuController.destroy')

  Route.get('/manager/add', 'ManagerController.add')
  Route.post('/manager/add', 'ManagerController.addSave').validator('manager')
  Route.get('/manager/list', 'ManagerController.list')
  Route.get('/manager/edit/:id', 'ManagerController.edit')
  Route.post('/manager/edit/:id', 'ManagerController.editSave').validator('managerEdit')
  Route.get('/manager/destroy/:id', 'ManagerController.destroy')

  Route.get('/role/add', 'RoleController.add')
  Route.post('/role/add', 'RoleController.addSave').validator('role')
  Route.get('/role/list', 'RoleController.list')
  Route.get('/role/edit/:id', 'RoleController.edit')
  Route.post('/role/edit/:id', 'RoleController.editSave').validator('role')
  Route.get('/role/destroy/:id', 'RoleController.destroy')

  Route.get('/article/category', 'ArticleController.category')
  Route.get('/article/categoryAdd', 'ArticleController.categoryAdd')
  Route.post('/article/categoryAdd', 'ArticleController.categorySave').validator('articleCategory')
  Route.get('/article/categoryEdit/:id', 'ArticleController.categoryEdit')
  Route.post('/article/categoryEdit/:id', 'ArticleController.categoryEditSave').validator('articleCategory')
  Route.get('/article/categoryDestroy/:id', 'ArticleController.categoryDestroy')
  Route.get('/article/add', 'ArticleController.add')
  Route.post('/article/add', 'ArticleController.addSave').validator('article')
  Route.get('/article/list', 'ArticleController.list')
  Route.get('/article/edit/:id', 'ArticleController.edit').validator('article')
  Route.post('/article/edit/:id', 'ArticleController.editSave')
  Route.get('/article/destroy/:id', 'ArticleController.destroy')

  Route.get('/goods/category', 'GoodsController.category')
  Route.get('/goods/categoryAdd', 'GoodsController.categoryAdd')
  Route.post('/goods/categoryAdd', 'GoodsController.categorySave').validator('goodsCategory')
  Route.get('/goods/categoryEdit/:id', 'GoodsController.categoryEdit')
  Route.post('/goods/categoryEdit/:id', 'GoodsController.categoryEditSave').validator('goodsCategory')
  Route.get('/goods/categoryDestroy/:id', 'GoodsController.categoryDestroy')
  Route.get('/goods/brands', 'GoodsController.brands')
  Route.get('/goods/brandsAdd', 'GoodsController.brandsAdd')
  Route.post('/goods/brandsAdd', 'GoodsController.brandsSave').validator('brands')
  Route.get('/goods/brandsEdit/:id', 'GoodsController.brandsEdit')
  Route.post('/goods/brandsEdit/:id', 'GoodsController.brandsEditSave').validator('brands')
  Route.get('/goods/brandsDestroy/:id', 'GoodsController.brandsDestroy')
  Route.get('/goods/attr', 'GoodsController.attr')
  Route.get('/goods/attrAdd', 'GoodsController.attrAdd')
  Route.post('/goods/attrAdd', 'GoodsController.attrSave').validator('attr')
  Route.get('/goods/attrEdit/:id', 'GoodsController.attrEdit')
  Route.post('/goods/attrEdit/:id', 'GoodsController.attrEditSave').validator('attr')
  Route.get('/goods/attrDestroy/:id', 'GoodsController.attrDestroy')
  Route.get('/goods/getAttr', 'GoodsController.getAttr')
  Route.get('/goods/list', 'GoodsController.list')
  Route.get('/goods/add', 'GoodsController.add')
  Route.post('/goods/add', 'GoodsController.addSave').validator('goods')
  Route.get('/goods/edit/:id', 'GoodsController.edit')
  Route.post('/goods/edit/:id', 'GoodsController.editSave').validator('goodsEdit')
  Route.get('/goods/destroy/:id', 'GoodsController.destroy')
  Route.get('/goods/checkSku', 'GoodsController.checkSku')
  Route.get('/goods/delAttr', 'GoodsController.delAttr')
  Route.get('/goods/delGroup', 'GoodsController.delGroup')
  Route.get('/goods/delGallery', 'GoodsController.delGallery')

  Route.get('/advert/list', 'AdvertController.list')
  Route.get('/advert/add', 'AdvertController.add')
  Route.post('/advert/add', 'AdvertController.addSave').validator('advert')
  Route.get('/advert/edit/:id', 'AdvertController.edit')
  Route.post('/advert/edit/:id', 'AdvertController.editSave').validator('advert')
  Route.get('/advert/destroy/:id', 'AdvertController.destroy')
  Route.get('/advert/delAdvertPhoto', 'AdvertController.delAdvertPhoto')

  Route.get('/system/shopInfo', 'SystemController.shopInfo')
  Route.post('/system/shopInfo', 'SystemController.shopInfoSave')

  Route.get('/member/list', 'MemberController.list')
  Route.get('/member/edit/:id', 'MemberController.edit')
  Route.post('/member/edit/:id', 'MemberController.editSave')
  Route.get('/member/cart/:id', 'MemberController.cart')

  Route.get('/file/pictures/(.*/?)', 'FileController.pictures')


}).middleware(['auth', 'role'])
