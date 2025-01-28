import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import getCurrentUser from '@/lib/getCurrentUser';
import MySQLAdapter from '@/lib/mysqlAdapter';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session?.user?.email) {
        return res.status(401).json({ error: 'Unauthorized. Plaese login.' });
      }
      const currentUser = await getCurrentUser(session.user.email);
      if (!currentUser) {
        return res.status(401).json({ error: 'Unauthorized.' });
      }
      const { title, description, imageSrc, category, latitude, longitude, price } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !imageSrc ||
        latitude === undefined ||
        longitude === undefined ||
        price === undefined
      ) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      const product = await MySQLAdapter.createProduct({
        title,
        description,
        imageSrc,
        category,
        latitude,
        longitude,
        userId: currentUser.id,
        price: Number(price),
      });
      return res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      return res.status(500).json({ error: 'Internal Server Error.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
