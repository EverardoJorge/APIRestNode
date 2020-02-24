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


/**
 *
 * EXPIRATION TOKEN
 * 60 SEC.
 * 60 MIN.
 * 24 HRS.
 * 30 DAYS
 *
 */

process.env.EXPIRATION_TOKEN = '48h';


/**
 *
 * SEED SECRET
 *
 */

process.env.SECRET_SEED = 'Super-secret';

/**
 *
 * DATABASE
 *
 */

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/coffee';
} else {
    urlDB = `${process.env.MONGO_URI}`;
}

/**
 *GOOGLE CLIENT ID
 */
process.env.CLIENT_ID = process.env.CLIENT_ID || '537204857195-e775aej6odk64s71gghm9u65sj5iemm3.apps.googleusercontent.com';


process.env.URLDB = urlDB;