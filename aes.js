'use strict';
const crypto = require('crypto');
const fs = require('fs');

// generate initialization vector
const generateIV = () => new Buffer.alloc(16);

// decrypt data
const decrypt = (data, algorithm, password) => {
    const decipher = crypto.createDecipheriv(algorithm, password, generateIV());
    let dec = decipher.update(data, 'hex', 'utf8');
    dec = dec + decipher.final('utf8');
    return(dec);
}

const encrypt = (data, algorithm, password) => {
    let cipher = crypto.createCipheriv(algorithm, password, generateIV());
    let encryptedData = cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
    return encryptedData;
}

// get password's md5 hash
const createPasswordHash = (password) => crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();


const app = () => {
    // Get information script
    const file = process.argv[2];
    const password = process.argv[3];

    // Validate
    if(!file) return console.error('Debe pasar el directorio del archivo como primer parametro');
    if(!password) return console.error('Debe pasar la contraseña como segundo parametro');

    // Set algorithm
    const algorithm = 'aes-256-cbc';

    // get password's md5 hash
    let password_hash = createPasswordHash(password);
    console.log('Key = ', password_hash); // 098F6BCD4621D373CADE4E832627B4F6

    // our data to encrypt
    let data = fs.readFileSync(file);
    console.log('Data = ', data.toString());

    // generate initialization vector
    let iv = generateIV(); // fill with zeros
    console.log('IV = ', iv);

    // encrypt data
    const encryptedData = encrypt(data, algorithm, password_hash);
    console.log('Encrypted data = ', encryptedData);

    // Create a file with encrypt data 
    const savedFile = fs.writeFileSync('encrypt-data.txt', encryptedData);

    // decrypt data
    const decryptData = decrypt(encryptedData, algorithm, password_hash);
    console.log('Decrypted data = ', decryptData);
}
app();
