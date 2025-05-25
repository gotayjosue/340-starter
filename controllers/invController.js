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

module.exports = invCont