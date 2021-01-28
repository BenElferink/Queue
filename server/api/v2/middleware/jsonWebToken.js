import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET = process.env.JWT_SECRET_V2;
// "secret key" generator   --->   https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
// Reminder: make sure to set up a secret key in .env (the presented 'secret' is not production valid)

export const generateToken = (data) => {
  return jwt.sign(data, new Buffer.from(SECRET, 'base64'), { expiresIn: '12h' });
};

export const authenticateToken = (token) => {
  let tokenData = {},
    tokenError = false;
  try {
    const decoded = jwt.verify(token, new Buffer.from(SECRET, 'base64'));
    tokenData = decoded;
  } catch (error) {
    console.log(error);
    isError = { error };
  }
  return { tokenData, tokenError };
};
