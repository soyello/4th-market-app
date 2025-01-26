import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import MySQLAdapter from '@/lib/mysqlAdapter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed.' });
  }
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await MySQLAdapter.createUser({ name, email, hashedPassword });
    console.log('User created', user);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database error', details: error });
  }
}
