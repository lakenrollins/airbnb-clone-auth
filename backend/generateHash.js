


const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = 'password';

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.log('Error hashing password', err);
  } else {
    console.log('Hashed Password:', hashedPassword);
  }
});
