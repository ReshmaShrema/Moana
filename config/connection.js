
// const mongoose = require('mongoose');
// console.log(process.env.MONGODB_CONNECTION_URL);
// const state={
//     db:null
// }
// module.exports.connect=function(done){
//     mongoose.connect(`${process.env.MONGODB_CONNECTION_URL}`)
//     .then( () => {
//         console.log('Database connected')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. n${err}`);
//     });

// }
// module.exports.get=function(){
//     return state.db
// }




/********************************************** */
// //install package mongodb
// const mongoClient = require('mongodb').MongoClient
// console.log(process.env.MONGODB_CONNECTION_URL);
// const state={
//     db:null
// }
// module.exports.connect=function(done){
//     mongoClient.connect(`${process.env.MONGODB_CONNECTION_URL}`)
//     .then( () => {
//         console.log('Database connected')
//     })
//     .catch( (err) => {
//         console.error(`Error connecting to the database. n${err}`);
//     });

// }
// module.exports.get=function(){
//     return state.db
// }
/****************************************************** */
// another form of connecting db
const mongoClient = require('mongodb').MongoClient
const state = {
    db: null
}
module.exports.connect = function (done) {
    const url = 'mongodb://localhost:27017'
    const dbname = 'Ecommerce'
    mongoClient.connect(url, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })
}
module.exports.get = function () {
    return state.db
}