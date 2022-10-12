const express = require('express');
const userHelpers = require('../helpers/userHelpers');
const OTPHelpers=require('../helpers/otp')
const router = express.Router();

// paypal configuration



// middleware setting
const verifyuserlogin = (req, res, next)=>{
     if(req.session.userLoggin){
      next();
     }else{
      res.redirect('/user/signin')
     }
};

// user home page
router.get("/",async (req,res,next)=>{
  res.header( "Cache-control",
  "no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0"
);
let cartCount=0;
if (req.session.userLoggin){
  cartCount=await userHelpers.getCartCount(req.session.user._id);
  req.session.cartCount=cartCount;
}
const carousal=await 
res.render('users/home',{
  user:true,
  userLoggin:req.session.userLoggin,
  cartCount
});
});

//user signup
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  //console.log(req.body);
      userHelpers.userSignup(req.body).then((response)=>{
        req.session.userLoggin=true;
        req.session.userLogginErr=false;
        res.redirect('/')
      });
});


//user signin
router.get('/signin',(req,res)=>{
  if(req.session.userLoggin){
    res.redirect('/');
  }
  else{
    res.render('user/signin',{
      logginErr:req.session.logginErr,
      message:req.session.message,
      blocked:req.session.blocked
    });
   req.session.logginErr=false;
   req.session.blocked=false;
 }
})

router.post('/signin',async(req,res)=>{
  await userHelpers.userSignin(req.body).then((response)=>{
    if(response.status){
      req.session.logginErr=false;
      req.session.userLogin=true;
      res.redirect('/');
    }
    else{
      req.session.message=response.message
      req.session.userLoggin=false
      req.session.logginErr=true;
      res.redirect('/user/signin');
    }
  })
})


router.get('/otp',(req,res)=>{
  //backward flow controller
  res.header(
        "Cache-control",
        "no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0"
      );
  //console.log(req.session.userLoggin)
  if(req.session.userLoggin){
    res.redirect('/');
  }
  else{
    OTPHelpers.sendOTP(req.session.mobileNumber,req.body.mobileNumber);
            res.render('user/otp',{
              phoneNumber:req.session.mobileNumber,
              OTPError:req.session.OTPError
            });
            req.session.OTPError=false;
    

  }
})


// router.get('/otp', (req,res)=>{
//   //backward flow controller
//   res.header(
//     "Cache-control",
//     "no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0"
//   );
//   if(req.session.userLoggin){
//     res.redirect('/');
//   }
//   else{
//     OTPHelpers.sendOTP(req.session.mobileNumber,req.body.mobileNumber);
//         res.render('user/otp',{
//           phoneNumber:req.session.mobileNumber,
//           OTPError:req.session.OTPError
//         });
//         req.session.OTPError=false;

//   }
// })

// router.post('/verifyOTP',(req,res)=>{
//   OTPHelpers.verifyOTP(req.body.OTPValue,r)
// })

router.get('/',(req,res)=>{
  req.session.userLoggin=true;
  res.render('user/home')
  
})




module.exports = router;
