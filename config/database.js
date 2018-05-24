if (process.env.NODE_ENV === 'production') {
  module.exports = { 
    database: 'mongodb://calis13:bison1812@ds151259.mlab.com:51259/upuss',
    secret: 'secret_key' 
  } //External db
}
else {
  module.exports = { 
    database: 'mongodb://localhost/UPUSS',
    secret: 'secret_key' 
   } //local db
}