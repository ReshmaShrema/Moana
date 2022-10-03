const db = require('../config/connection');
const collection = require('../config/collection');
const objectid = require('mongodb').ObjectId;
const bcrypt =  require('bcrypt');

module.exports={
    adminSignin:(userData)=>{
        return new Promise(async(response,reject)=>{
            let result={};
            let message;
            let user = await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:userData.email});
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
                response({status:false,message:'Invalid Email'})
            }
        })
    }
}


