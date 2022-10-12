const db=require('../config/connection');
const collection=require('../config/collection');
const objectid =require('mongodb').ObjectId;


module.exports={
    addProduct:(productData)=>{
        return new Promise(async (response,reject)=>{
            await db.get().collection(collection.PRODUCT_COLLECTION).insertOne(productData).then((result)=>{
                response(result.insertedId);
            });
        });
    },
getAllProduct:()=>{
    return new Promise(async(response,reject)=>{
        let product =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
        response(product)
    })
},
deleteProduct:(id)=>{
    return new Promise((response,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({
            _id:objectid(id)
        }).then((result)=>{
            response(result);
        })
    })
},
getProduct:(id)=>{
    return new Promise((response,reject)=>{
        let product=db.get().collection(collection.PRODUCT_COLLECTION).findOne({
            _id:objectid(id)
        });
        response(product)
    })
},
editProduct:(editedProduct,id)=>{
    return new Promise((response,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({
            _id:objectid(id)
        },
        {
            $set:{
                productName:editedProduct.productName,
                price:editedProduct.price,
                discription:editedProduct.discription,
                category:editedProduct.category,
                subcategory:editedProduct.subcategory,
                stock:editedProduct.stock
            },
        }).then((result)=>{
            response(result.insertedId)
        })
    })
},
getProductDetails:(productId)=>{
    return new Promise(async(response,reject)=>{
        let productDetails=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({
            _id:objectid(productId)
        })
        response(productDetails)
    })
}
}