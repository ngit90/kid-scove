const express = require("express");
const mongoose = require("mongoose");
const Products = require("./products.model");
const Category = require("./category.model")
const Reviews = require("../reviews/reviews.model");
const verifyToken = require("../middleware/verifyToken");
const verifyAdmin = require("../middleware/verifyAdmin");
const router = express.Router();

// post a product
router.post("/create-product", async (req, res) => {
  try {
    const newProduct = new Products({
      ...req.body,
    });

    const savedProduct = await newProduct.save();
    // calculate review
    const reviews = await Reviews.find({ productId: savedProduct._id });
    if (reviews.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = totalRating / reviews.length;
      savedProduct.rating = averageRating;
      await savedProduct.save();
    }
    res.status(201).send(savedProduct);
  } catch (error) {
    console.error("Error creating new product", error);
    res.status(500).send({ message: "Failed to create new product" });
  }
});
// get all products
router.get("/list", async (req, res) => {
  try {
    const products = await Products.find({delstats:"actived"});
    res.status(200).send(products);
  } catch (error) {
    console.error("Error fetching productss", error);
    res.status(500).send({ message: "Error fetching products" });
  }
});


// get all categories
router.get("/categorylist", async (req, res) => {
  try {
    const categories = await Category.find({delstats:"actived"});
    res.status(200).send(categories);
  } catch (error) {
    console.error("Error fetching categories", error);
    res.status(500).send({ message: "Error fetching categories" });
  }
});

// get all categoriesadmin
router.get("/categorylistadmin", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).send(categories);
  } catch (error) {
    console.error("Error fetching categories", error);
    res.status(500).send({ message: "Error fetching categories" });
  }
});

// get all products
router.get("/", async (req, res) => {
  try {
    const {
      category,
      agegroup,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (agegroup && agegroup !== "all") {
      filter.agegroup = agegroup;
    }

    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }
    //console.log('filter',filter);
    filter.delstats = 'actived';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
  
    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send({ products, totalPages, totalProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
});

// get all products admin
router.get("/admin/", async (req, res) => {
  try {
    const {
      category,
      agegroup,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    if (agegroup && agegroup !== "all") {
      filter.agegroup = agegroup;
    }

    if (minPrice && maxPrice) {
      const min = parseFloat(minPrice);
      const max = parseFloat(maxPrice);
      if (!isNaN(min) && !isNaN(max)) {
        filter.price = { $gte: min, $lte: max };
      }
    }
    //console.log('filter',filter);
    //filter.delstats = 'actived';

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProducts = await Products.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));
  
    const products = await Products.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("author", "email")
      .sort({ createdAt: -1 });
    res.status(200).send({ products, totalPages, totalProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: "Failed to fetch products" });
  }
});

//   get single Product
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId).populate(
      "author",
      "email username"
    );
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    if (product.delstats === 'deleted') {
      return res.status(404).send({ message: "Product not found" });
    }
    const reviews = await Reviews.find({productId}).populate(
      "userId",
      "username email"
    );
    res.status(200).send({ product, reviews });
  } catch (error) {
    console.error("Error fetching the product", error);
    res.status(500).send({ message: "Failed to fetch the product" });
  }
});

// update a product
router.patch("/update-product/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      { ...req.body },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }
    if (updatedProduct.delstats === 'deleted') {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating the product", error);
    res.status(500).send({ message: "Failed to update the product" });
  }
});

// delete a product

router.delete("/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Products.findByIdAndUpdate(productId, {delstats:"deleted"});

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    // delete reviews related to the product
    await Reviews.deleteMany({ productId: productId });

    res.status(200).send({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting the product", error);
    res.status(500).send({ message: "Failed to delete the product" });
  }
});

// get related products
router.get("/related/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "Product ID is required" });
    }
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    if (product.delstats === 'deleted') {
      return res.status(404).send({ message: "Product not found" });
    }

    const titleRegex = new RegExp(
      product.name
        .split(" ")
        .filter((word) => word.length > 2)
        .join("|"),
        "i"
    );
  
    const relatedProducts = await Products.find({
      _id: { $ne: id }, 
      delstats: {$ne: 'deleted'},
      $or: [
        { name: { $regex: titleRegex} }, // Match similar names
        { category: product.category}, // Match the same category
      ],
    });
    //console.log(relatedProducts);
    res.status(200).send(relatedProducts);

  } catch (error) {
    console.error("Error fetching the related products", error);
    res.status(500).send({ message: "Failed to fetch related products" });
  }
});

router.post('/deleteImage', async (req, res) => {
  const { id, url } = req.body;
  //console.log(id, url);
  try {
    const updatedProduct = await Products.findByIdAndUpdate(
      id,
      { $pull: { images: url } }, 
      { new: true } 
    );
    //console.log('updated is', updatedProduct);
    if (!updatedProduct) {
      return res.status(404).send({ error: 'Product not found' });
    }

    res.status(200).send({
      message: 'Image URL removed successfully',
      updatedProduct,
    });
  } catch (error) {
    console.error('Error removing image URL:', error);
    res.status(500).send({ error: 'Failed to remove image URL' });
  }
});

// create a category
router.post("/create-category", async (req, res) => {
  try {
    const newCategory = new Category({
      ...req.body,
    });
    const {label, value} = req.body;
    const categ = await Category.findOne({label });
    if (categ) {
      return res.status(400).send({ message: "Already exist actegory" });
    }
    const categ2 = await Category.findOne({ value });
    if (categ2) {
      return res.status(400).send({ message: "Already exist actegory" });
    }
    const savedCategory = await newCategory.save();
    res.status(201).send(savedCategory);
  } catch (error) {
    console.error("Error creating new category", error);
    res.status(500).send({ message: "Failed to create new category" });
  }
});

// delete a category
router.delete("/category/:id", async (req, res) => {
  try {
    const catId = req.params.id;
    console.log('catid',catId);
    const deletedCat = await Category.findByIdAndUpdate(catId,{delstats:"deleted"});
    console.log('deletedcat',deletedCat);
    if (!deletedCat) {
      return res.status(404).send({ message: "Category not found" });
    }
    // Delete products with this category
    const deletedProducts = await Products.updateMany({ category: deletedCat.value },{delstats:"deleted"});
    console.log('Deleted products:', deletedProducts);

    res.status(200).send({message: "Category deleted successfully"});
  } catch (error) {
    console.error("Error deleting the Category", error);
    res.status(500).send({ message: "Failed to delete the category" });
  }
});

//   get single Category
router.get("/category/:id", async (req, res) => {
  try {
    const catId = req.params.id;
    const cat = await Category.findById(catId).populate(
      "author",
      "email username"
    );
    if (!cat) {
      return res.status(404).send({ message: "Category not found" });
    }
    if (cat.delstats === 'deleted') {
      return res.status(404).send({ message: "Category not found" });
    }
   
    res.status(200).send({ cat });
  } catch (error) {
    console.error("Error fetching the category", error);
    res.status(500).send({ message: "Failed to fetch the category" });
  }
});

// update a category
router.patch("/update-category/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const catId = req.params.id;
    const categ = await Category.findById(catId);
    //console.log('category',categ);
    const updatedCategory = await Category.findByIdAndUpdate(
      catId,
      { ...req.body },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).send({ message: "Category not found" });
    }
    if (updatedCategory.delstats === 'deleted') {
      return res.status(404).send({ message: "Category not found" });
    }

    // If category name changes, update associated products
    if (updatedCategory.label) {
      const updatedProducts = await Products.updateMany(
        { category: categ.value  }, // Find products with this category value
        { category: updatedCategory.value } // Update products with new category value
      );

      //console.log("Updated products:", updatedProducts);
    }

    res.status(200).send({
      message: "Category updated successfully",
      product: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating the category", error);
    res.status(500).send({ message: "Failed to update the category" });
  }
});


module.exports = router;
