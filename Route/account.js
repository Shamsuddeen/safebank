// Initialize express router
const express = require('express');
const {
    getAccounts,
    getAccount,
    getUserAccount,
    createAccount,
    virtualAccount,
    updateAccount
} = require('../Controller/account');

const router = express.Router({ mergeParams: true });

// card routes
router
    .route('/')
    .get(getAccounts)
    .post(createAccount);
router
    .route('/virtual')
    .post(virtualAccount);
router
    .route('/:id')
    .get(getAccount)
    .put(updateAccount);
router
    .route('/user/:user')
    .get(getUserAccount);
module.exports = router;