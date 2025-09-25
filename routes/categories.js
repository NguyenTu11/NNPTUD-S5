var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category');

/* GET categories listing. */
router.get('/', async function(req, res, next) {
  let categories = await categoryModel.find({isDelete: false})
  res.send({
    success: true,
    data:categories
  });
});

router.get('/:id', async function(req, res, next) {
  try {
    let item = await categoryModel.findById(req.params.id);
    if (!item || item.isDelete) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
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
    // Kiểm tra xem category với tên này đã tồn tại (và chưa bị xóa) chưa
    const existingCategory = await categoryModel.findOne({ 
      name: req.body.name, 
      isDelete: false 
    });
    
    if (existingCategory) {
      return res.status(400).send({
        success: false,
        message: "Category with this name already exists"
      });
    }
    
    let newItem = new categoryModel({
      name: req.body.name
    })
    await newItem.save()
    res.send({
      success: true,
      data:newItem
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      data:error
    })
  }
})

router.put('/:id', async function(req,res,next){
  let updatedItem = await categoryModel.findByIdAndUpdate(
    req.params.id,
    {
      name:req.body.name
    },{
      new:true
    }
  )
  res.send({
      success: true,
      data:updatedItem
    })
})

router.delete('/:id', async function(req, res, next) {
  try {
    let deletedItem = await categoryModel.findByIdAndUpdate(
      req.params.id,
      { isDelete: true },
      { new: true }
    );
    
    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    res.send({
      success: true,
      data: deletedItem,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: error,
      message: "Error deleting category"
    });
  }
});

// Route để clear tất cả categories (chỉ dùng để test)
router.delete('/clear-all', async function(req, res, next) {
  try {
    await categoryModel.deleteMany({});
    res.send({
      success: true,
      message: "All categories cleared"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: error
    });
  }
});

// GET products by category
router.get('/:id/products', async function(req, res, next) {
  try {
    const categoryId = req.params.id;
    // Kiểm tra category có tồn tại không
    const category = await categoryModel.findById(categoryId);
    if (!category || category.isDelete) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    // Lấy tất cả products thuộc category này
    const productModel = require('../schemas/product');
    const products = await productModel.find({
      category: categoryId,
      isDelete: false
    }).populate('category');
    
    res.send({
      success: true,
      data: products,
      category: category
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: error
    });
  }
});

module.exports = router;