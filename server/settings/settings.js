/**
 * 
 * PUERTO
 * 
 */
 process.env.PORT = process.env.PORT || 3000;


 /**
  * 
  * ENVIROMENT
  *
  */

  process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

  /***
   * 
   * DATABASE
   * 
   */
  
   let urlDB;

   if ( process.env.NODE_ENV === 'dev' ) {
       urlDB = 'mongodb://localhost:27017/coffee';
   } else {
       urlDB = 'mongodb+srv://faker_admin:8VWWF475ihOce9kp@cluster0-lwgnk.mongodb.net/coffee';
   }



process.env.URLDB = urlDB;