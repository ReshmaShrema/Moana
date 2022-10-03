const db=require('../config/connection');
const collection =require('../config/collection');
const objectid =require('mongodb').ObjectId;
const bcrypt =require('bcrypt');




module.exports={
    userSignup:(userData)=>{
       // console.log(userData);
        return new Promise(async(response,reject)=>{
            userData.password=await bcrypt.hash(userData.password,10);
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
            response(data);
        });
        });
    },

      userSignin:(userData)=>{
        console.log(userData);
        return new Promise(async(response,reject)=>{
            let result={};
            let messsage;
            let user= await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email});
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        result.user=user;
                        result.status=true;
                        
                        response(result);

                    }
                    else{
                        response({status:false,message:'Invalid Password'});
                    }
                });
            } 
            else{
                response({status:false,message:'Invalid EmailId'});
            }  
            })
      }



}
