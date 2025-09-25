var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product')



/* GET users listing. */
router.get('/', async function(req, res, next) {
  let products = await productModel.find({isDelete: false}).populate('category')
  res.send({
    success: true,
    data:products
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let item = await productModel.findById(req.params.id).populate('category');
    if (!item || item.isDelete) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    res.send({
      success: true,
      data:item
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data:error
    })
  }
});
router.post('/', async function(req,res,next){
  try {
    console.log('POST /products - Request body:', req.body);
    
    // Kiểm tra category có tồn tại không
    const categoryModel = require('../schemas/category');
    const category = await categoryModel.findById(req.body.category);
    if (!category || category.isDelete) {
      console.log('Category not found:', req.body.category);
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    let newItem = new productModel({
      name: req.body.name,
      price:req.body.price,
      description:req.body.description,
      category:req.body.category
    })
    await newItem.save()
    
    // Populate category để trả về đầy đủ thông tin
    await newItem.populate('category');
    
    console.log('Product created successfully:', newItem);
    
    res.send({
      success: true,
      data:newItem
    })
  } catch (error) {
    console.log('Error creating product:', error);
    res.status(404).send({
      success: false,
      data:error
    })
  }
})
router.put('/:id', async function(req,res,next){
  try {
    // Kiểm tra category có tồn tại không (nếu có category trong request)
    if (req.body.category) {
      const categoryModel = require('../schemas/category');
      const category = await categoryModel.findById(req.body.category);
      if (!category || category.isDelete) {
        return res.status(404).send({
          success: false,
          message: "Category not found"
        });
      }
    }
    
    let updatedItem = await productModel.findByIdAndUpdate(
      req.params.id,
      {
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category
      },{
        new:true
      }
    ).populate('category')
    
    res.send({
        success: true,
        data:updatedItem
      })
  } catch (error) {
    res.status(500).send({
      success: false,
      data:error
    })
  }
})

// Soft delete - đổi isDelete về true
router.delete('/:id', async function(req, res, next) {
  try {
    let deletedItem = await productModel.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );
    
    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    
    res.send({
      success: true,
      data: deletedItem,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: error,
      message: "Error deleting product"
    });
  }
});

module.exports = router;
