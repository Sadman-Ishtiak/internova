import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const industry = searchParams.get('industry');
  const location = searchParams.get('location'); // 'remote', 'local', or city name
  const hiring = searchParams.get('hiring'); // 'internship', 'job', or 'any'

  let query = { status: 'active' };

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (industry && industry !== 'all') {
    query.industry = industry;
  }

  if (location && location !== 'all') {
    // Case-insensitive search within the location array
    query['contact.location'] = { $regex: location, $options: 'i' };
  }

  try {
    let companies = await Company.find(query).lean();

    // Now attach job counts (we do this manually or via aggregate, manual is simpler for small scale)
    // For a larger app, use aggregate $lookup
    const companyIds = companies.map(c => c._id);
    const activeJobs = await Job.find({ 
      companyId: { $in: companyIds },
      deadline: { $gt: new Date() }
    }).select('companyId type');

    // Filter and Map
    companies = companies.map(company => {
      const companyJobs = activeJobs.filter(j => j.companyId.toString() === company._id.toString());
      const internshipCount = companyJobs.filter(j => j.type === 'internship').length;
      const jobCount = companyJobs.filter(j => j.type === 'job').length;

      return {
        ...company,
        stats: {
          internships: internshipCount,
          jobs: jobCount,
          total: companyJobs.length
        }
      };
    });

    // Filter by Hiring Status if requested
    if (hiring === 'internship') {
      companies = companies.filter(c => c.stats.internships > 0);
    } else if (hiring === 'job') {
      companies = companies.filter(c => c.stats.jobs > 0);
    } else if (hiring === 'any') {
      companies = companies.filter(c => c.stats.total > 0);
    }

    return NextResponse.json({ companies });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
