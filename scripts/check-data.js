import dbConnect from '../lib/db.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';

async function checkData(email) {
  await dbConnect();
  
  console.log(`Checking data for user email: ${email}`);
  
  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found!");
    process.exit(1);
  }
  
  console.log(`User ID: ${user._id}`);
  console.log(`User's companyId: ${user.companyId}`);
  
  if (user.companyId) {
    const company = await Company.findById(user.companyId);
    console.log(`Company Found: ${company ? 'YES' : 'NO'}`);
    if (company) {
      console.log(`Company ID: ${company._id}`);
      console.log(`Company Name: ${company.name}`);
    }
  } else {
    console.log("User has no companyId set.");
  }

  console.log("\n--- All Jobs ---");
  const jobs = await Job.find({});
  console.log(`Total Jobs in DB: ${jobs.length}`);
  
  jobs.forEach(job => {
    const match = user.companyId && job.companyId && job.companyId.toString() === user.companyId.toString();
    console.log(`Job: ${job.title} | ID: ${job._id} | CompanyId: ${job.companyId} | Matches User's Company? ${match ? 'YES' : 'NO'}`);
  });

  process.exit(0);
}

const email = process.argv[2];
if (!email) {
  console.log("Usage: node --env-file=.env.local scripts/check-data.js <email>");
  process.exit(1);
}

checkData(email);
