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
  const classificationSelect = await utilities.buildClassificationList()
  res.render('inventory/management', {
    title: 'Inventory Management',
    nav,
    html,
    classificationSelect
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


/* ***************************
 *  Add a new car function
 * ************************** */
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build edit vehicle view
 * ************************** */

invCont.editVehicleView = async function (req, res, next){
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  console.log(inv_id)
  const itemData = await invModel.getVehicleByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render('inventory/edit-inventory', {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Edit a car function
 * ************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


module.exports = invCont