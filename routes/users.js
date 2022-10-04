var express = require('express');
const userHelpers = require('../helpers/userHelpers');
var router = express.Router();

/* GET users listing. */

//user signup
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})
router.post('/signup',(req,res)=>{
  //console.log(req.body);
      userHelpers.userSignup(req.body).then((response)=>{
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
      logginErr:req.session.logginErr,message:req.session.message
    });
   req.session.logginErr=false;
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
  res.send('success');
})



router.post('/otp',async (req,res)=>{
  res.send('success')
})

router.get('/',(req,res)=>{
  res.render('user/home')
})

// router.get('/signout',(req,res)=>{
//   req.session.destroy();
//   req.session.userLoggin=false;
//   res.redirect('/');
// })


// //session control on going back to signin
// res.header(
//   "Cache-control",
//   "no-cache,private, no-store, must-revalidate,max-stale=0,post-check=0"
// );
module.exports = router;
