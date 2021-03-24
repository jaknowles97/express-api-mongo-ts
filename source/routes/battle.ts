import express from 'express';
import controller from '../controllers/battle';

const router = express.Router();

router.get('/get/all', controller.getAllBattles);

router.get('/get/id', controller.getBattle);

router.post('/create', controller.createBattle);

export = router;
