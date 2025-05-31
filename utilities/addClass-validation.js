const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

const invModel = require("../models/inventory-model")

validate.classificationRules = () => {
  return [
    body("classification_name")
      .notEmpty().withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/).withMessage("Classification name must not contain spaces or special characters.")
      .trim()
      .escape()
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const html = await utilities.buildAddClassificationView()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors,
      html,
      classification_name
    })
    return
  }
  next()
}

module.exports = validate
