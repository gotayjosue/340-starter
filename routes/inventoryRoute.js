// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const classValidate = require("../utilities/addClass-validation")
const invValidate = require("../utilities/addVehicle-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build the detail view
router.get("/detail/:inventoryId", invController.buildDetailView)

//Route to build the classification view
router.get('/', invController.managementView)

//Route to build the "Add Classification" view
router.get('/add-classification', invController.addClassificationView)

//Route to build the "Add New Vehicle" view
router.get('/add-vehicle', invController.addVehicleView)

//Route to build the url inside the javascript file
router.get('/getInventory/:classification_id', invController.getInventoryJSON)

//Route to build the update car view
router.get('/edit/:inv_id', invController.editVehicleView)



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

module.exports = router;