import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import AuthController from '../controllers/AuthController';
import FilesController from '../controllers/FilesController';

function controllerRouting(app) {
  const router = express.Router();
  app.use('/', router);

  // App Controller
  router.route('/status').get(AppController.getStatus);
  router.route('/stats').get(AppController.getStats);

  // User Controller
  router.route('/users').post(UsersController.postNew);
  router.route('/users/me').get(UsersController.getMe);

  // Auth Controller
  router.route('/connect').get(AuthController.getConnect);
  router.route('/disconnect').get(AuthController.getDisconnect);

  // Files Controller
  router.route('/files').post(FilesController.postUpload);
  router.route('/files/:id').get(FilesController.getShow);
  router.route('/files').get(FilesController.getIndex);
  router.route('/files/:id/publish').put(FilesController.putPublish);
  router.route('/files/:id/unpublish').put(FilesController.putUnpublish);
  router.route('/files/:id/data').get(FilesController.getFile);
}

export default controllerRouting;
