const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */

Util.buildVehicleDetailView = async function(vehicle){
 const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  const miles = new Intl.NumberFormat('en-US').format(vehicle.inv_miles)

  return `
    <div class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <div class="about">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} Details </h2>
        <p class="price"><strong>Price: ${formatter.format(vehicle.inv_price)}</strong> </p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p class="color"><strong>Color:</strong> ${vehicle.inv_color}</p>
        <p><strong>Mileage:</strong> ${miles} miles</p> 
      </div>
    </div>
  `
}

/* **************************************
* Build the login view HTML
* ************************************ */

Util.buildLoginView = async function(account_email=""){
  return `
    <form class="signIn" action="/account/login" method="post">
      <label>Email:<input type="email" required name="account_email" title="Your username" value="${account_email}"></label>
      <label>Password:<input type="password" required name="account_password" title="Your password" pattern="^(?=.*\\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$"></label>
      <p><strong>Password must be:</strong></p>
      <ul>
        <li>12 characters in length, minimun</li>
        <li>Contain at least 1 capital letter</li>
        <li>Contain at least 1 number</li>
        <li>Contain at least 1 special character</li>
      </ul>
      <div class="buttonContainer">
        <button type="submit">Login</button>
      </div>
      <p>No account? <span><a href="/account/registration">Sign-up</a></span></p>
    </form>`
}

/* **************************************
* Build the register view HTML
* ************************************ */

Util.buildRegisterView = async function(
  account_firstname = "",
  account_lastname = "",
  account_email = ""
){
  return `
    <form class="signUp" action="/account/register" method="post">
      <label>First name<input type="text" required name="account_firstname" title="Your first name" autocomplete="given-name" value="${account_firstname}"></label>
      <label>Last name<input type="text" required name="account_lastname" title="Your last name" autocomplete="family-name" value="${account_lastname}"></label>
      <label>Email:<input type="email" required name="account_email" title="Your username" value="${account_email}"></label>
      <label>Password:<input type="password" required name="account_password" title="Your password" pattern="^(?=.*\\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\\s).{12,}$"></label>
      <p><strong>Password must be:</strong></p>
      <ul>
        <li>12 characters in length, minimun</li>
        <li>Contain at least 1 capital letter</li>
        <li>Contain at least 1 number</li>
        <li>Contain at least 1 special character</li>
      </ul>
      <div class="buttonContainer">
        <button type="submit">Register</button>
      </div>
    </form>`
}

/* **************************************
* Build the management view HTML
* ************************************ */

Util.buildManagementView = async function(){
  return `
    <div class="addLinks">
      <a href="/inv/add-classification">Add New Classification</a>
      <a href="/inv/add-vehicle">Add New Vehicle</a>
      <h2>Manage Inventory</h2>
      <p>Select a classification from the list to see the items belonging to the classification</p>
    </div>
  `
}

/* **************************************
* Build the add classification view HTML
* ************************************ */

Util.buildAddClassificationView = async function(){
  return `
    <form class="classForm" action="/inv/add-classification" method="post">
      <p>NAME MUST BE ALPHABETIC CHARACTERS ONLY</p>
      <label>Classification Name:<input type="text" required name="classification_name" title="Classification" pattern="/^[A-Za-z0-9]+$/)"></label>
      <div class="buttonContainer">
        <button type="submit">Add Classification</button>
      </div>
    </form>`
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkAccountType = (req, res, next) => {
  const account = res.locals.accountData

  if (!account || !account.account_type) {
    req.flash("notice", "You must be logged in to access that page.")
    return res.redirect("/account/login")
  }

  if (account.account_type === "Employee" || account.account_type === "Admin") {
    return next()
  } else {
    req.flash("notice", "You do not have permission to access that page.")
    return res.redirect("/account/login")
  }
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util