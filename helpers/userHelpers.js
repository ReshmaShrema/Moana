const db = require("../config/connection");
const collection = require("../config/collection");
const objectid = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const { response } = require("express");

module.exports = {
  userSignup: (userData) => {
    // console.log(userData);
    return new Promise(async (response, reject) => {
      userData.password = await bcrypt.hash(userData.password, 10);
      userData.mobileNumber = `+91${userData.mobileNumber}`;
      db.get()
        .collection(collection.USER_COLLECTION)
        .insertOne(userData)
        .then((data) => {
          response(data);
        });
    });
  },

  userSignin: (userData) => {
    console.log(userData);
    return new Promise(async (response, reject) => {
      let result = {};
      let messsage;
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            result.user = user;
            result.status = true;

            response(result);
          } else {
            response({ status: false, message: "Invalid Password" });
          }
        });
      } else {
        response({ status: false, message: "Invalid EmailId" });
      }
    });
  },
  addToCart: (productId, userId) => {
    let productObject = {
      item: objectid(productId),
      quantity: 1,
    };
    return new Promise(async (response, reject) => {
      const userCart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({
          user: objectid(userId),
        });
      if (userCart) {
        let isProductExist = userCart.products.findIndex(
          (product) => product.item == productId
        );
        if (isProductExist != -1) {
          db.get()
            .collection(collection.CART_COLLECTIONS)
            .updateOne(
              { "products.item": objectid(productId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              response();
            });
        } else {
          db.get()
            .collection(collection.CART_COLLECTIONS)
            .updateOne(
              {
                user: objectid(userId),
              },
              {
                $push: {
                  products: productObject,
                },
              }
            )
            .then((result) => {
              response(result);
            });
        }
      } else {
        const cartObject = {
          user: objectid(userId),
          products: [productObject],
        };
        db.get()
          .collection(collection.CART_COLLECTIONS)
          .insertOne(cartObject)
          .then((result) => {
            response(result);
          });
      }
    });
  },
  getAllCart: (userId) => {
    return new Promise(async (response, reject) => {
      let cartItems = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .aggregate([
          {
            $match: {
              user: objectid(userId),
            },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "products",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: {
                $arrayElementAt: ["$products", 0],
              },
            },
          },
        ])
        .toArray();
      response(cartItems);
    });
  },
  removeProduct: (productData) => {
    return new Promise((response, reject) => {
      db.get()
        .collection(collection.CART_COLLECTIONS)
        .updateOne(
          { _id: objectid(productData.cartId) },
          {
            $pull: { products: { item: objectid(productData.productId) } },
          }
        )
        .then((response) => {
          response(response);
        });
    });
  },

  getCartCount: (userId) => {
    return new Promise(async (res, rej) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({ user: objectid(userId) });
      if (cart) {
        cart.products.forEach((item) => {
          count + -item.quantity;
        });
      }
      response(count);
    });
  },
  changeProductCount: (details) => {
    count = parseInt(details.count);
    quantity = parseInt(details.quantity);
    return new Promise((response, reject) => {
      if (count == -1 && quantity == 1) {
        db.get()
          .collection(collection.CART_COLLECTIONS)
          .updateOne(
            { _id: objectid(details.cart) },
            {
              $pull: {
                product: {
                  item: objectid(details.product),
                },
              },
            }
          )
          .then((response) => {
            response({
              removeProduct: true,
            });
          });
      } else {
        db.get()
          .collection(collection.CART_COLLECTIONS)
          .updateOne(
            {
              _id: objectid(details.cart),
              "products.item": objectid(details.product),
            },
            {
              $inc: { "products.$.quantity": count },
            }
          )
          .then((response) => {
            response(true);
          });
      }
    });
  },
  getTotalAmount: (userId) => {
    return new Promise(async (response, reject) => {
      productData = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .aggregate([
          {
            $match: {
              user: objectid(userId),
            },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "products",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              project: {
                $arrayElementAt: ["$products", 0],
              },
            },
          },
        ])
        .toArray();
      let total = 0;
      let overAllTotal = 0;
      productData.forEach((item) => {
        total = item.quantity * item.product.price;
        overAllTotal += total;
      });
      response(overAllTotal);
    });
  },
  placeOrder: (orderData, products, totalPrice) => {
    return new Promise((response, reject) => {
      let status = orderData.paymentMethod === "cod" ? "placed" : "pending";
      let today = new Date();
      let date = ("0" + today.getDate()).slice(-2);
      let month = ("0" + (today.getMonth() + 1)).slice(-2);
      let year = today.getFullYear();
      let hours = today.getHours();
      let amORpm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      let minutes = today.getMinutes();
      let currentTime =
        year +
        "-" +
        month +
        "-" +
        date +
        "/" +
        hours +
        ":" +
        minutes +
        " " +
        amORpm;
      let orderObject = {
        userId: objectid(orderData.userId),
        paymentMethod: orderData.paymentMethod,
        products: products,
        status: status,
        totalPrice: totalPrice,
        date: currentTime,
        deliveryDetails: {
          name: orderData.name,
          phone: orderData.phone,
          address: orderData.address,
          pincode: orderData.pincode,
        },
      };
      // product checkout
      db.get()
        .collection(collection.ORDER_COLLECTIONS)
        .insertOne(orderObject)
        .then((response) => {
          //deleting from the cart
          db.get()
            .collection(collection.CART_COLLECTIONS)
            .deleteOne({
              user: objectid(orderData.userId),
            })
            .then((response) => {});
          response(response.insertedId);
        });
    });
  },
  getCartProductList: (userId) => {
    return new Promise(async (res, rej) => {
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTIONS)
        .findOne({
          user: objectid(userdId),
        });
      response(cart.products);
    });
  },
  getAllOrders: (user) => {
    return new Promise(async (response, reject) => {
      let order = await db
        .get()
        .collection(collection.ORDER_COLLECTIONS)
        .find({
          userId: objectid(user._id),
        })
        .toArray();
      response(order);
    });
  },
  getOrderedProducts: (orderId) => {
    return new Promise(async (response, reject) => {
      let orderDetails = await db
        .get()
        .collection(collection.ORDER_COLLECTIONS)
        .aggregate([
          {
            $match: { _id: objectid(orderId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              paymentMethod: 1,
              totalPrice: 1,
              date: 1,
              status: 1,
              deliveryDetails: 1,
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              item: 1,
              quatity: 1,
              product: { $arrayElementAt: ["$product", 0] },
              paymentMethod: 1,
              totalPrice: 1,
              deliveryDetails: 1,
              date: 1,
              status: 1,
            },
          },
        ])
        .toArray();
      response(orderDetails);
    });
  },

  changePaymentStatus: (orderId) => {
    return new Promise((response, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTIONS)
        .updateOne(
          { _id: objectid(orderId) },
          {
            $set: {
              status: "placed",
            },
          }
        )
        .then(() => {
          response();
        });
    });
  },

  cancelOrder: (orderId) => {
    return new Promise((response, reject) => {
      db.get()
        .collection(collection.ORDER_COLLECTIONS)
        .updateOne(
          { _id: onrejectionhandled(orderId) },
          {
            $set: {
              status: "Cancelled By Customer",
            },
          }
        )
        .then(() => {
          response();
        });
    });
  },
};
