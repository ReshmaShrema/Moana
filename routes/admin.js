const express = require('express');
const router =express.Router();

//setting variables
const username=process.env.ADMIN_USERNAME;
const password=process.env.ADMIN_PASSWORD;

//middleware
const verifyAdminLogin =(req,res,next)=>{
    //hard setting login to true
    (req.session.adminLoggin==true)?next():res.redirect('/admin/sigin');       
}

router.get('/signin',(req,res)=>{
    (req.session.adminLoggin==true)?res.redirect('/admin'):res.render('admin/signin',{adminLogginErr:req.session.adminLogginErr,message:req.session.message,admin:true,adminLogginPage:true})
})


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
router.get('/demo',(req,res)=>{
    res.render('admin/demo')
})
module.exports=router;









