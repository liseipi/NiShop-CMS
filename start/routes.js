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

Route.on('/').render('welcome')

Route.on('/login').render('auth.login')
Route.post('/login', 'AuthController.signIn')

Route.get('/manager/add', 'ManagerController.add')

Route.get('/role/add', 'RoleController.add')
Route.post('/role/add', 'RoleController.addSave').validator('role')
Route.get('/role/list', 'RoleController.list')
Route.get('/role/edit/:id', 'RoleController.edit')
Route.post('/role/edit/:id', 'RoleController.editSave').validator('role')
Route.get('/role/destroy/:id', 'RoleController.destroy')
