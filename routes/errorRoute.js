const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")
const utilities = require("../utilities")

// The route /error will activate the error
router.get("/error-test", utilities.handleErrors(errorController.causeError))

module.exports = router