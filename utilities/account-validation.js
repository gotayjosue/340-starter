const utilities = require(".")
    const { body, validationResult } = require("express-validator")
    const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .notEmpty().withMessage("Please provide a first name.") // on error this message is sent.
        .isLength({ min: 1 }).withMessage("First name doesn't meet the requirements")
        .trim()
        .escape(),
  
      // lastname is required and must be string
      body("account_lastname")
        .notEmpty().withMessage("Please provide a last name.") // on error this message is sent.
        .isLength({ min: 2 }).withMessage("Last name doesn't meet the requirements")
        .trim()
        .escape(),
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .notEmpty().withMessage("Please provide an email")
      .isEmail().withMessage("A valid email is required.")
      .normalizeEmail() // refer to validator.js docs
      .trim()
      .escape(),
  
      // password is required and must be strong password
      body("account_password")
        .notEmpty().withMessage("Please provide a password")
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }).withMessage("Password does not meet requirements.")
        .trim(),
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const html = await utilities.buildRegisterView()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      html,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

module.exports = validate