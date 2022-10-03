let adminLoggErr;
exports.getAdminLogin=(req,res)=>{
    // if(req.session.adminLoggin){
    //     res.redirect('/dashboard')
    // }
    // else{
        res.render('admin/signin',{adminLoggErr:adminLoggErr});
   // }
}

exports.postAdminLogin=(req,res)=>{
          username.findOne({email:req.body.email})
          .exec((error,user)=>{
            if(error){
                 adminLoggErr='Something went wrong'
                 res.redirect('/signin')   
            }
            if(user){
                if(user.role == 'admin'){
                    if(user.authenticate(req.body.password)){
                        
                    }

                }
            }
          })
}

// exports.signin=(req,res)=>{
//   User.findOne({ email:req.body.email})
//   .exec((error,user)=>{
//              if(error)
//                    return res.status(400).json({message :"Something went wrong"});
//               if(user){
//                    if(user.role ==='admin'){
//                     if(user.authenticate(req.body.password)){
//                         const token = jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:'1h'})
//                         const {_id,firstName,lastName,email,role,fullName}=user;
//                         res.status(200).json({token,_id,user:{firstName,lastName,email,role,fullName}});
//                   }
//                   else {
//                      return res.status(400).json({
//                               message:"Invalid Password"
//                           })
//                       }
//                     }
//                     else{
//                       return res.status(400).json({
//                         message:"Authentication Error-Admin profile"
//                     })
//                     }
//                   }
//               else{
//                  return res.status(400).json({message:"email-id doesn't exist"});
//                  }
//               })
//            }


   












exports.getAdminHomepage=(req,res)=>{
    res.render('admin/home',{ admin: true, adminLogginPage: false })
}




let username=process.env.ADMINUSERNAME;
let password=process.env.ADMINPASSWORD;
exports.adminLogin=(req,res)=>{
    if(req.body.name==username &&req.body.password ==password){
        req.session.adminLoggin=true;
        console.log('admin login successfull');
        adminLoginErr=false;
        res.render('admin/dashbord');
    }else{
     console.log("Admin login failed");
     adminLoggErr=true;
     res.redirect('/admin') 
    }
}

