import { AdapterUser } from 'next-auth/adapters';
import MySQLAdapter from './mysqlAdapter';

export default async function getCurrentUser(email: string): Promise<AdapterUser | null> {
  try {
    if (!email) {
      console.warn('No email provided for getCurrentUser.');
      return null;
    }
    const currentUser = await MySQLAdapter.getUser(email);
    console.log('currentUser', currentUser);

    if (!currentUser) {
      console.warn(`No user found with email: ${email}`);
      return null;
    }
    return currentUser;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw new Error('Failed to fetch current user.');
  }
}
