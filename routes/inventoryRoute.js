// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classValidate = require("../utilities/addClass-validation")
const invValidate = require("../utilities/addVehicle-validation")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build the detail view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildDetailView))

//Route to build the classification view
router.get('/', utilities.handleErrors(invController.managementView))

//Route to build the "Add Classification" view
router.get('/add-classification', utilities.handleErrors(invController.addClassificationView))

//Route to build the "Add New Vehicle" view
router.get('/add-vehicle', utilities.handleErrors(invController.addVehicleView))

//Route to build the url inside the javascript file
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON))

//Route to build the update car view
router.get('/edit/:inv_id', utilities.handleErrors(invController.editVehicleView))

//Route to build the delete car view
router.get('/delete/:inv_id', utilities.handleErrors(invController.deleteVehicleView))



//Process add classification attempt
router.post(
    "/add-classification",
    classValidate.classificationRules(),
    classValidate.checkClassificationData,
    invController.addClassification
)

//Proccess add vehicle attemp
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
)

//Route to update the inventory
router.post(
    "/edit-inventory", 
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    invController.updateInventory)

//Route to delete a car from the inventory
router.post("/delete-confirm", invController.deleteInventory)

module.exports = router;