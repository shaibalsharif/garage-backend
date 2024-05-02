const express = require('express');
const router = express.Router();
const carController = require('../controller/carController');


router.get('/', carController.getCarList);
router.post('/add', carController.addCar);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);

// router.get('/:id', carController.getCarById);




module.exports = router;
