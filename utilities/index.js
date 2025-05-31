const invModel = require("../models/inventory-model")
const Util = {}

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
      <label>Password:<input type="password" required name="account_password" title="Your password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"></label>
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
      <label>Password:<input type="password" required name="account_password" title="Your password" pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$"></label>
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


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util