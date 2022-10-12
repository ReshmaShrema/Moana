const express = require('express');
const router =express.Router();
const adminUserHelpers=require('../helpers/adminUserHelpers')
const productHelpers=require('../helpers/productHelpers')
const categoryHelpers=require('../helpers/categoryHelpers');
const { response } = require('express');


//setting variables
const username=process.env.ADMIN_USERNAME;
const password=process.env.ADMIN_PASSWORD;

//middleware
const verifyAdminLogin =(req,res,next)=>{
    (req.session.adminLoggin==true)?next():res.redirect('/admin/signin');       
};

// admin signin
router.get('/signin',(req,res)=>{
    (req.session.adminLoggin==true)?res.redirect('/admin'):res.render('admin/signin',{adminLogginErr:req.session.adminLogginErr,message:req.session.message,admin:true,adminLogginPage:true})
});
router.post('/signin',(req,res)=>{
    if(req.body.username == process.env.ADMIN_USERNAME){
        if(req.body.password==process.env.ADMIN_PASSWORD){
              req.session.adminLoggin=true;
            req.session.adminLogginErr=false;
            res.redirect('/admin');
        }else{
             req.session.adminLogginErr = true;
             req.session.message="Invalid Password";
            res.redirect('/admin/signin')   
            }
    }
    else{
        req.session.adminLogginErr=true;
        req.session.message="Invalid Username"
        res.redirect('/admin/signin');
    }    
})

//admin Signout
router.get('/signout',(req,res)=>{
    req.session.adminLoggin=false;
    res.redirect('/admin/signin')
});


//admin page
router.get('/',verifyAdminLogin,(req,res,next)=>{
    res.header(
        "Cache-control",
        "no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0"
      );
    res.render('admin/dashbord',{admin:true,adminLogginPage:false});
})

//user management
router.get('/user',verifyAdminLogin,(req,res)=>{
    adminUserHelpers.getAllUsers().then((allUserDetails)=>{
       // console.log('allUserDetails',allUserDetails);
        res.render('admin/userManagement',{
            admin:true,adminLoggin:req.session.adminLoggin,allUserDetails
        });
    });
});

//block user
router.get('/user/block/:id',verifyAdminLogin,(req,res)=>{
    const userId=req.params.id;
    adminUserHelpers.blockUser(userId).then((response)=>{
        res.redirect('/admin/user')
    })
});

//unblock user
router.get('/user/unblock/:id',verifyAdminLogin,(req,res)=>{
    const userId=req.params.id;
    adminUserHelpers.unblockUser(userId).then((response)=>{
        res.redirect('/admin/user')
    })
});
//category Management
router.get('/category',verifyAdminLogin,(req,res)=>{
    categoryHelpers.getAllCategory().then((category)=>{
        res.render('admin/category',{
            admin:true,adminLoggin:req.session.adminLoggin,category
        })
    });
});

//add category
router.get('/category/add',(req,res)=>{
     res.render('admin/categoryAdd',{admin:true,adminLoggin:req.session.adminLoggin});
});
router.post('/category/add',(req,res)=>{
    categoryHelpers.addCategory(req.body).then((response)=>{
        res.redirect('/admin/category');
    });
});

//delete Category
router.get('/category/delete/:id',(req,res)=>{
    const id = req.params.id;
    categoryHelpers.deleteCategory(id).then((response)=>{
        res.redirect('/admin/category')
    })
})
//subCategory Management
router.get('/subCategory',verifyAdminLogin,(req,res)=>{
    const id=req.params.id;
    categoryHelpers.getAllSubCategory().then((subCategory)=>{
        res.render('admin/subCategory',{
            admin:true,adminLoggin:req.session.adminLoggin,subCategory
        });
    })
})

//add subcategory
router.get('/subCategory/add',verifyAdminLogin,(req,res)=>{
    res.render('admin/subCategoryAdd',{
        admin:true,adminLoggin:req.session.adminLoggin
    })
})
router.post('/subCategory/add',(req,res)=>{
    categoryHelpers.addSubCategory(req.body).then((response)=>{
        res.redirect('/admin/subCategory');
    });
})

//delete SubCategory
router.get('/subCategory/delete/:id',(req,res)=>{
    const id=req.params.id;
    categoryHelpers.deleteSubCategory(id).then((response)=>{
        res.redirect('/admin/subCategory');
    });
});




//product management
router.get('/product',verifyAdminLogin,(req,res)=>{
    productHelpers.getAllProduct().then((product)=>{
        res.render('admin/product',{admin:true,adminLoggin:req.session.adminLoggin,product})
    })
})
//addProduct
router.get('/product/add',verifyAdminLogin,(req,res)=>{
    Promise.all([
        categoryHelpers.getAllCategory(),
        categoryHelpers.getAllSubCategory(),
    ]).then((response)=>{
        res.render('admin/productAdd',{admin:true,adminLoggin:req.session.adminLoggin,category:response[0],subCategory:response[1]})
    });
});
 router.post('/product/add',(req,res)=>{
    productHelpers.addProduct(req.body).then((response)=>{
        let id=response.toString();
        let image =req.files.image;
        image.mv('./public/productPictures/'+id +'.jpg');
        res.redirect('/admin/product')
    })
 })

// delete product
router.get('/product/delete/:id',(req,res)=>{
    const productId =req.params.id;
    productHelpers.deleteProduct(productId).then((response)=>{
        res.redirect('/admin/product')
    })
})

// edit product
router.get('/product/edit/:id',(req,res)=>{
    const productId=req.params.id;
    Promise.all([
        categoryHelpers.getAllCategory(),
        categoryHelpers.getAllSubCategory(),
        productHelpers.getProduct(productId)        
]).then((response)=>{
    res.render('admin/productEdit',{
        admin:true,adminLogin:req.session.adminLoggin,category:response[0],subCategory:response[1],editingProduct:response[2],modelJqury:true
    })
})
})
router.post('/product/edit/:id',(req,res)=>{
    const id=req.params.id;
    productHelpers.editProduct(req.body,id).then((response)=>{
        res.redirect('/admin/product');
        if(req.body){
            let image =req.files.image;
            image.mv('./public/productPictures/'+id +'.jpg');
        }
    })
})
module.exports=router;












