import express from 'express';
import controller from '../controllers/robot';

const router = express.Router();

router.get('/get/all', controller.getAllRobots);

router.get('/get/:id', controller.getRobot);

router.post('/create', controller.createRobot);

router.put('/update', controller.updateRobot);

router.delete('/delete/:id', controller.deleteRobot);

export = router;
