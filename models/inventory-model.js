const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleByInventoryId(inventoryId){
  try{
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inventoryId]
    )
    return data.rows[0]
  } catch (error) {
    throw new Error("Database query failed")
  }
}

/* Function to add a new classification into the DB */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
    const data = await pool.query(sql, [classification_name])
    return data.rowCount
  } catch (error) {
    console.error("addClassification error:", error)
    return error.message
  }
}


/* Function that allows insert a new car into the DB */

async function insertInventory(
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
) {
  try {
    const sql = `
      INSERT INTO inventory
        (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `
    const values = [
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
    ]
    const result = await pool.query(sql, values)
    return result.rowCount
  } catch (error) {
    console.error("insertInventory error:", error)
    return error.message
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
async function deleteInventory(inv_id) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1"
    const data = await pool.query(sql, [inv_id])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Get all classifications data (array)
 * ************************** */

async function getClassificationsData() {
  const result = await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
  return result.rows // <- Esto es lo que espera tu EJS
}

/* ***************************
 *  Get all classifications by id
 * ************************** */

async function getClassificationById(classification_id){
  try{
    const data = await pool.query(
      `SELECT * FROM public.classification WHERE classification_id = $1`,
      [classification_id]
    )
    return data.rows[0]
  } catch (error) {
    throw new Error("Database query failed")
  }
}

/* ***************************
 *  Update Classification
 * ************************** */
async function updateClassification(
  classification_name,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.classification SET classification_name = $1 WHERE classification_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      classification_name,
      classification_id,
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



module.exports = {getClassifications, getInventoryByClassificationId, getVehicleByInventoryId, addClassification, insertInventory, updateInventory, deleteInventory, getClassificationsData, getClassificationById, updateClassification }
