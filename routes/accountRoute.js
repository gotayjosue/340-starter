const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const validate = require("../utilities/account-validation")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.accountView))

//Deliver Login View

router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Deliver Registration View
router.get("/registration", utilities.handleErrors(accountController.buildRegister))

//Deliver Update view
router.get("/accountUpdate", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdate))

//Logout route
router.get("/logout", utilities.handleErrors(accountController.logout))

//Enable registration route
router.post(
    '/register', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Process the login attempt
router.post(
    "/login",
    validate.loginRules(),
    validate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

//Enable the account update process
router.post(
    '/update',
    validate.updateAccountRules(),
    validate.checkUpdateData,
    utilities.handleErrors(accountController.accountUpdate)
)

//Enable the password update process
router.post(
    '/update-password',
    validate.passwordRules(),
    validate.checkPasswordData,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router;