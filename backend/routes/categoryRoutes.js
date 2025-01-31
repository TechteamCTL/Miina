const express = require('express')
const router = express.Router()
const { getCategories, newCategory, deleteCategory, saveAttr, categoriesForProductList, updateCategoryDisplay, getSubcategoriesT2 } = require("../controllers/categoryController")
const { verifyIsLoggedIn, verifyIsAdmin } = require("../middleware/verifyAuthToken")
console.log("test categoryyyy");
router.get("/subcategories", getSubcategoriesT2)
router.get("/categoryBlocks/:categoryPath", categoriesForProductList)
router.get("/", getCategories)

router.use(verifyIsAdmin)
router.post("/", newCategory)
router.post("/updateDisplay", updateCategoryDisplay)
router.delete("/:category", deleteCategory) //有：是说this is dynamic part of the address
router.post("/attr", saveAttr) //没有：是说this is NOT dynamic part of the address


module.exports = router

