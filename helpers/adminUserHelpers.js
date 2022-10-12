const db=require('../config/connection');
const collection =require('../config/collection');
const objectId = require('mongodb').ObjectId;


module.exports={
    getAllUsers:()=>{
        return new Promise(async(response,reject)=>{
            let userDetails=await db.get().collection(collection.USER_COLLECTION).find().toArray();
            response(userDetails);
        });
    },

    blockUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},
            {$set:{ blocked :true}}).then((response)=>{
                resolve(response);
            });
        });
    },
    unblockUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{blocked:false}}).then((response)=>{
                resolve(response);
            });
        });
    }



}