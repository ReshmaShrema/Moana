const db=require('../config/connection')
const collection=require('../config/collection')
const objectid = require('mongodb').ObjectId;


module.exports={

    addCarousel:(carouselData)=>{
        return new Promise(async(response,reject)=>{
            await db.get().collection(collection.CAROUSEL_COLLECTIONS).insertOne(carouselData).then((result)=>{
                response(result.insertedId)
            })
        })
    },
    getCarousel: ()=>{
        return new Promise(async(response,reject)=>{
            let carousels = await db.get().collection(collection.CAROUSEL_COLLECTIONS).find().toArray();
            response(carousels);
        })
    },
    deleteCaursol:(caursolId)=>{
        return new Promise(async (response,reject)=>{
            db.get().collection(collection.CAROUSEL_COLLECTIONS).deleteOne({_id:objectid(caursolId)
            }).then((result)=>{
                response(result)
            })
        })
    }



}


