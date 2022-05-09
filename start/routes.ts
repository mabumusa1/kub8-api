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

/*
 * v1 Routes defined here
 */
Route.group(() => {
  Route.group(() => {
    Route.post('create', 'InstallsController.create')
    Route.delete('delete/:id', 'InstallsController.delete').where('id', /^[a-z0-9_-]*$/)
    Route.post('copy', 'InstallsController.copy')
    Route.post('backup', 'InstallsController.backup')
    Route.post('setDomain', 'InstallsController.setDomain')
  }).prefix('install')
})
  .prefix('v1')
  .middleware('auth', { guards: ['basic'] })
