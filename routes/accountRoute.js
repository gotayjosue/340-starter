const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')
const validate = require("../utilities/account-validation")

//Deliver Login View

router.get("/login", utilities.handleErrors(accountController.buildLogin))

//Deliver Registration View
router.get("/registration", utilities.handleErrors(accountController.buildRegister))

//Enable registration route
router.post(
    '/register', 
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

// Precess the login attempt
router.post(
    "/login",
    validate.loginRules(),
    validate.checkLoginData,
    (req, res) => {
        res.status(200).send('login process')
    }
)

module.exports = router;