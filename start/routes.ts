/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
Route.where('id', {
  match: /^[a-zA-Z0-9_.-]*$/,
})
Route.group(() => {
  Route.group(() => {
    Route.post('/', 'InstallsController.create')
    Route.put('/', 'InstallsController.update')
    Route.delete('/', 'InstallsController.delete')
    Route.post('copy', 'InstallsController.copy')
    Route.post('stop', 'InstallsController.stop')
    Route.post('backup/:source', 'InstallsController.backup').where('source', {
      match: /^(automated|user)$/
    })
    Route.post('setdomain', 'InstallsController.setDomain')
  }).prefix('install/:id')
}).prefix('v1')
