const db = require('../config/connection')
const collection=require('../config/collection')
const objectId = require('mongodb').ObjectId;

module.exports={
    addCategory:(categoryName)=>{
        return new Promise((response,reject)=>{
         db.get().collection(collection.CATEGORY_COLLECTION).insertOne(categoryName).then((result)=>{
            //passing the response it may use helpfull in future
            response(result);
         });   
        })
    },

    getAllCategory:()=>{
        return new Promise((response,reject)=>{
            let category=db.get().collection(collection.CATEGORY_COLLECTION).find().toArray();
            response(category);
    })
    },
    deleteCategory:(id)=>{
        return new Promise((response,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:objectId(id)}).then((result)=>{
               response(result)
            })
        })
    },
    getAllSubCategory:()=>{
        return new Promise(async(response,reject)=>{
            let subCategory = await db.get().collection(collection.SUB_CATEGORY_COLLECTION).find().toArray();
            response(subCategory);
         });
    },
     addSubCategory:(subCategory)=>{
        return new Promise((response,reject)=>{
            db.get().collection(collection.SUB_CATEGORY_COLLECTION).insertOne(subCategory).then((result)=>{
                response(result)
            });
        });
     },

     deleteSubCategory:(id)=>{
        return new Promise((response,reject)=>{
            db.get().collection(collection.SUB_CATEGORY_COLLECTION).deleteOne({_id:objectId(id)}).then((result)=>{
                response(result)
            })
        })
     },

}