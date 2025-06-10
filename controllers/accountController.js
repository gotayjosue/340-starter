const utilities = require('../utilities')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
* Deliver login view
* ****************************************/

async function buildLogin(req, res, next){
    let nav = await utilities.getNav()

    const html = await utilities.buildLoginView()
        res.render("account/login", {
            title: "Login",
            nav,
            html,
            errors: null
        })
    
}

/* ****************************************
* Deliver registration view
* ****************************************/

async function buildRegister(req, res, next){
    let nav = await utilities.getNav()

    const html = await utilities.buildRegisterView()
        res.render("account/register",{
            title: "Register",
            nav,
            html,
            errors: null
        })
    }

/* ****************************************
* Deliver account management view
* ****************************************/

async function accountView(req, res, next){
    let nav = await utilities.getNav()

        res.render("account/account",{
            title: "Account Management",
            nav,
            errors: null
        })
    }


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    const html = await utilities.buildRegisterView()
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      html,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    const html = await utilities.buildLoginView()
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      html,
      errors: null
    })
  } else {
    const html = await utilities.buildRegisterView()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      html
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    const html = await utilities.buildLoginView(account_email)
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      html,
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      const html = await utilities.buildLoginView(account_email)
      res.status(400).render("account/login", {
        title: "Login",
        html,
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
* Deliver account update view
* ****************************************/

async function buildUpdate(req, res, next){
    let nav = await utilities.getNav()
    let account = res.locals.accountData
        res.render("account/update",{
            title: "Account Update",
            nav,
            errors: null,
            account_firstname: account.account_firstname,
            account_lastname: account.account_lastname,
            account_email: account.account_email,
            account_id: account.account_id
        })
    }


/* ****************************************
* Deliver account update function
* ****************************************/
async function accountUpdate(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    const accountData = await accountModel.getAccountById(account_id)
    res.locals.accountData = accountData
    return res.redirect("/account")
  } else {
    req.flash("notice", "Update failed.")
    return res.redirect("/account/accountUpdate")
  }
}

/* ****************************************
* Deliver password update function
* ****************************************/

async function changePassword(req, res) {
  const { account_id, account_password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updatePassword(account_id, hashedPassword)

    if (result) {
      req.flash("notice", "Password updated successfully.")
      const accountData = await accountModel.getAccountById(account_id)
      res.locals.accountData = accountData
      return res.redirect("/account")
    } else {
      req.flash("notice", "Password update failed.")
      return res.redirect("/account/accountUpdate")
    }
  } catch (error) {
    req.flash("notice", "An error occurred.")
    return res.redirect("/account/accountUpdate")
  }
}

/* ****************************************
* Deliver logout function
* ****************************************/

async function logout(req, res) {
  res.clearCookie('jwt');
  req.flash("notice", "You have successfully logged out")
  return res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, accountView, buildUpdate, accountUpdate, changePassword, logout }