import dbConnect from '../lib/db.js';
import User from '../models/User.js';

async function removeAdmin(email) {
  try {
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'user' },
      { new: true }
    );
    
    if (user) {
      console.log(`SUCCESS: User ${email} is no longer an admin. Role set to 'user'.`);
    } else {
      console.log(`ERROR: User ${email} not found.`);
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
  console.error('Usage: node --env-file=.env.local scripts/remove-admin.js <email>');
  process.exit(1);
}

removeAdmin(email);
