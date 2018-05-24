//if (process.env.NODE_ENV === 'production') {
  module.exports = { 
    database: 'mongodb://Dave:1234@ds131697.mlab.com:31697/UPUSS',
    secret: 'secret_key' 
  } //External db
//}
//else {
//  module.exports = { 
 //   database: 'mongodb://localhost/UPUSS',
  //  secret: 'secret_key' 
  // } //local db
//}