import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import getCurrentUser from '@/lib/getCurrentUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.email) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const currentUser = await getCurrentUser(session.user.email);
    res.status(200).json(currentUser);
  } catch (error) {
    res.status(404).json(error);
  }
}
