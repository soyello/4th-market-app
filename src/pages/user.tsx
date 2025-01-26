import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from './api/auth/[...nextauth]';
import getCurrentUser from '@/lib/getCurrentUser';
import { serializedUser } from '@/helper/serialization';
import { AdapterUser } from 'next-auth/adapters';

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const { res, req } = context;
    const session = await getServerSession(req, res, authOptions);

    console.log('session', session);
    if (!session?.user?.email) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }
    const currentUser = await getCurrentUser(session.user.email);

    return {
      props: {
        currentUser: currentUser ? serializedUser(currentUser) : null,
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    };
  }
};

const UserPage = ({ currentUser }: { currentUser: AdapterUser }) => {
  return <div>나는 행복한 고구마</div>;
};

export default UserPage;
