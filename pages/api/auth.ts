import { getAuth } from '@openlab/vercel-netlify-cms-github';

export default (
  getAuth({
    // scopes: ['public_repo'],
    scopes: ['repo', 'user'],
    secure: process.env.NODE_ENV === 'production',
  }),
);
