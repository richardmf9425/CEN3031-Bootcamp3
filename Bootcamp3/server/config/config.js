//This file holds any configuration variables we may need 
//'config.js' is ignored by git to protect sensitive information, such as your database's username and password
//copy this file's contents to another file 'config.js' and store your MongoLab uri there

//I had to indicate the database in the string

module.exports = {
  db: {
     uri: 'mongodb+srv://bootcampUser:cen3031access@cen3031-course-qlxug.mongodb.net/bootcamp2?retryWrites=true&w=majority', //place the URI of your mongo database here.
  }, 
  openCage: {
    key: 'dd82c4da77f3461388010f5c8950ba27' //place your openCage public key here - Sign-up for a free key https://opencagedata.com/
  },
  port: 8080
};