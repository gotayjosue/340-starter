const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model")

const validate = {}

validate.inventoryRules = () => {
  return [
    // classification_id
    body("classification_id")
      .isInt({ min: 1 })
      .withMessage("Select a valid classification."),

    // Make
    body("inv_make")
      .notEmpty().withMessage("Please provide the vehicle make.")
      .isLength({ min: 3 }).withMessage("Make must be at least 3 characters.")
      .trim()
      .escape(),

    // Model
    body("inv_model")
      .notEmpty().withMessage("Please provide the vehicle model.")
      .isLength({ min: 3 }).withMessage("Model must be at least 3 characters.")
      .trim()
      .escape(),

    // Description
    body("inv_description")
      .optional({ checkFalsy: true })
      .isLength({ min: 20 }).withMessage("Description must be at least 20 characters.")
      .trim()
      .escape(),

    // Image Path
    body("inv_image")
      .notEmpty().withMessage("Please provide the image path.")
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png|gif)$/)
      .withMessage(
        "Image path must start with /images/vehicles/ and end in .jpg/.jpeg/.png/.gif"
      )
      .trim(),

    // Thumbnail Path
    body("inv_thumbnail")
      .notEmpty().withMessage("Please provide the thumbnail path.")
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png|gif)$/)
      .withMessage(
        "Thumbnail path must start with /images/vehicles/ and end in .jpg/.jpeg/.png/.gif"
      )
      .trim(),

    // Price
    body("inv_price")
      .notEmpty().withMessage("Please provide a price.")
      .isFloat({ min: 0 }).withMessage("Enter a valid price (decimal or integer).")
      .toFloat(),

    // Year
    body("inv_year")
      .notEmpty().withMessage("Please provide a year.")
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Enter a valid 4-digit year.")
      .toInt(),

    // Miles
    body("inv_miles")
      .notEmpty().withMessage("Please provide miles.")
      .isInt({ min: 0 }).withMessage("Miles must be a non-negative integer.")
      .toInt(),

    // Color
    body("inv_color")
      .notEmpty().withMessage("Please provide a color.")
      .trim()
      .escape(),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
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

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classifications = await invModel.getClassifications()
    let nav = await utilities.getNav()
    const html = await utilities.buildAddVehicleView()

    res.render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      html,
      classifications,
      errors,
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
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
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
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classifications = await invModel.getClassifications()
    let nav = await utilities.getNav()

    res.render("inventory/edit-inventory", {
      title: `Edit , ${inv_make} ${invModel}`,
      nav,
      classifications,
      errors,
      classification_id,
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
    })
    return
  }
  next()
}

module.exports = validate
