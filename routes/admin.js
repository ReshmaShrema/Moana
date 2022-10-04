const express = require('express');
const router =express.Router();


router.get('/signin',(req,res)=>{
    if(req.session.adminLoggin){
        res.redirect('/admin');
        }
        else{
            console.log('ssd',req.session.adminLogginErr);
            res.render('admin/signin',{adminLogginErr:req.session.adminLogginErr,message:req.session.message})
        }
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
module.exports=router;









