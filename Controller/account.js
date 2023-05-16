const ErrorResponse = require('../Utils/errorResponse');
const asyncHandler = require('../Middleware/async');
const sendRequest = require('../Utils/sendRequest');
const User = require('../Model/User');
const Account = require('../Model/Account');
const Transaction = require('../Model/Transaction');

exports.getAccounts = asyncHandler(async (req, res, next) => {
    const accounts = await Account.find();
    res.status(200).json({
        status: "success",
        count: accounts.length,
        message: 'Accounts fetched successfully',
        data: accounts
    });
});

// Get a Single
exports.getAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.findById(req.params.id);

    if (account == null) {
        res.send({
            status: "error",
            message: "Account not found!",
        });
        return next(new ErrorResponse("Account not found!", 404));
        // console.log('account not found - 404');
    } else{
        res.status(200).json({
            status: "success",
            message: 'Account fetched successfully',
            data: {
                account
            }
        })
    }
});

exports.getUserAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.findOne({ user: req.params.user });

    if (account == null) {
        res.send({
            status: "error",
            message: "User have no account issued!",
        });
        return next(new ErrorResponse("User have no account issued!", 404));
    }

    res.status(200).json({
        status: "success",
        message: 'Account fetched successfully',
        data: {
            account
        }
    })
});

exports.createAccount = asyncHandler(async (req, res, next) => {
    // Check if user exists
    const user = await User.findById(req.body.user);
    if (!user._id) {
        return next(new ErrorResponse("User not found!", 404));
    }
    // console.log(user);
    const name = user.firstName + ' ' + user.lastName

    // Create and Map Account to Customer with default funding source
    const account = await sendRequest('safehaven', '/accounts/subaccount', 'post', {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phone,
        emailAddress: user.email,
        externalReference: user._id,
        bvn: user.identity.number,
        autoSweep: true,
        autoSweepDetails: {
            schedule: "Instant",
            accountNumber: process.env.SAFEHAVEN_DEBIT_ACCOUNT
          },
        metadata: {}
    });
    console.log(account);
    if (account.statusCode != 200) {
        return next(new ErrorResponse("Request Error, Unable to create account", 400));
    }

    // Save Account to DB
    const result = await Account.create({
        user: req.body.user,
        accountId: account.data._id,
        number: account.data.accountNumber,
        name: account.data.accountName
    });

    res.status(201).json({
        status: "success",
        message: 'Account created successfully',
        data: result
    });
});

exports.virtualAccount = asyncHandler(async (req, res, next) => {
    // Check if user exists
    const user = await User.findById(req.body.user);
    if (!user._id) {
        return next(new ErrorResponse("User not found!", 404));
    }
    // console.log(user);
    const name = user.firstName + ' ' + user.lastName
    // console.log('====================================');
    // console.log(req);
    // console.log('====================================');
    // Create and Map Account to Customer with default funding source
    const account = await sendRequest('safehaven', '/virtual-accounts', 'post', {
        validFor: 900,
        settlementAccount: {
            bankCode: "999240",
            accountNumber: process.env.SAFEHAVEN_DEBIT_ACCOUNT
        },
        accountName: name,
        amountControl: "Fixed",
        callbackUrl: "https://localhost:3000/callback",
        amount: 1000
    });
    console.log(account);
    if (account.statusCode != 200) {
        return next(new ErrorResponse("Request Error, Unable to create account", 400));
    }

    // Save Account to DB
    const result = await Account.create({
        user: req.body.user,
        accountId: account.data._id,
        number: account.data.accountNumber,
        name: account.data.accountName
    });

    res.status(201).json({
        status: "success",
        message: 'Account created successfully',
        data: result
    });
});

exports.updateAccount = asyncHandler(async (req, res, next) => {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        status: "success",
        data: account
    });
});