const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build detail view
 * ************************** */
invCont.buildDetailView = async function (req, res, next){
  const inventoryId = req.params.inventoryId
  const data = await invModel.getVehicleByInventoryId(inventoryId)
  let nav = await utilities.getNav()

  const html = await utilities.buildVehicleDetailView(data)
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      html,
    })
  
}

/* ***************************
 *  Build management view
 * ************************** */

invCont.managementView = async function (req, res, next){
  let nav = await utilities.getNav()
  const html = await utilities.buildManagementView()

  res.render('inventory/management', {
    title: 'Inventory Management',
    notice: req.flash('notice'),
    error: req.flash('Error'),
    nav,
    html
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */

invCont.addClassificationView = async function (req, res, next){
  let nav = await utilities.getNav()
  const html = await utilities.buildAddClassificationView()

  res.render('inventory/add-classification', {
    title: 'Add New Classification',
    nav,
    errors: null,
    html
  })
}

/* ***************************
 *  Add classification function
 * ************************** */

invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if(result) {
    req.flash("notice", "Classification added succesfully.")
    res.redirect("/inv")
  }else {
    let nav = await utilities.getNav()
    const html = await utilities.buildAddClassificationView()
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      html,
      nav,
      errors: null,
      classification_name
    })
  }
}

/* ***************************
 *  Build add vehicle view
 * ************************** */

invCont.addVehicleView = async function (req, res, next){
  let nav = await utilities.getNav()
  const html = await utilities.buildAddVehicleView()

  res.render('inventory/add-inventory', {
    title: 'Add Vehicle',
    nav,
    html,
    errors: null
  })
}

invCont.addInventory = async function (req, res) {
  // Extracts all the fields from the form
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  try {
    // It calls the model to insert data into the DB
    const result = await invModel.insertInventory(
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color
    )

    if (result) {
      //If it works redirects to the management view
      req.flash("notice", "Vehicle added successfully.")
      res.redirect("/inv")
    } else {
      throw new Error("Insert failed")
    }
  } catch (error) {
    console.error("addInventory error:", error)
    // In case of error, it reloads the form with error messages
    const classifications = await invModel.getClassifications()
    let nav = await utilities.getNav()
    const html = await utilities.buildAddVehicleView(
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    )

    req.flash("Error", "Failed to add vehicle.")
    res.status(500).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      html,
      classifications,
      errors: null,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
  }
}


module.exports = invCont