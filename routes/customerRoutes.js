const express = require('express');
const router = express.Router();
const customerController = require('../controller/customerController');


router.get('/', customerController.getCustomers);
router.post('/create', customerController.createCustomer);


router.get('/:id', customerController.getCustomerById);
router.put('/:id', customerController.updateCustomer);

router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
