const ErrorResponse = require('../Utils/errorResponse');
const asyncHandler = require('../Middleware/async');
const User = require('../Model/User');
const sendRequest = require('../Utils/sendRequest');

exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        status: "success",
        data: users
    });
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id, (err, result) => {
        if (!result) {
            return next(new ErrorResponse("User not foud!", 404));
        }
        res.status(200).json({
            success: true,
            status: "success",
            data: result
        })
    })
});

exports.sendOtp = asyncHandler(async (req, res, next) => {
    // const user = await User.findById(req.user._id).select('+password');
    // console.log(req);
    // if (!user) {
    //     return next(new ErrorResponse('User not found', 404));
    // }

    const {
        phoneNumber
    } = req.body;

    const sendOtp = await sendRequest('safehaven', '/identity/send-otp', 'POST', {"phoneNumber": phoneNumber});
    console.log('====================================');
    console.log(sendOtp);
    console.log('====================================');
    if(sendOtp.statusCode == "200"){
        res.send({
            "status": "success",
            "message": sendOtp.message,
            "data": sendOtp.data
        });
    }else{
        return next(new ErrorResponse("Unable to send OTP!", 400));
    }
});

exports.verifyBvn = asyncHandler(async (req, res, next) => {
    // const user = await User.findById(req.user._id);
    // console.log(req);
    // if (!user) {
    //     return next(new ErrorResponse('User not found', 404));
    // }

    const {
        phoneNumber, bvn, otp, otpId
    } = req.body;

    const data = {
        "async": false,
        "debitAccountNumber": process.env.SAFEHAVEN_DEBIT_ACCOUNT,
        "phoneNumber": phoneNumber,
        "otp": otp,
        "otpId": otpId,
        "type": "bvn",
        "number": bvn
    } 

    const verifyBvn = await sendRequest('safehaven', '/identity', 'POST', data);
    console.log('====================================');
    console.log(verifyBvn);
    console.log('====================================');
    if(verifyBvn.statusCode == "200"){
        res.send({
            "status": "success",
            "message": verifyBvn.message,
            "data": verifyBvn.data
        });
    }else{
        res.send({
            "status": "error",
            "message": verifyBvn.message,
            "data": verifyBvn.data
        });
    }
});