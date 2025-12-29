import dbConnect from '../lib/db.js';
import User from '../models/User.js';

async function makeAdmin(email) {
  try {
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`SUCCESS: User ${email} is now an admin.`);
    } else {
      console.log(`ERROR: User ${email} not found. Please register the account first.`);
    }
    process.exit(0);
  } catch (err) {
    console.error('An error occurred:', err);
    process.exit(1);
  }
}

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address.');
  console.error('Usage: node --env-file=.env.local scripts/make-admin.js <email>');
  process.exit(1);
}

makeAdmin(email);
