import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import NavItem from './NavItem';
import { AdapterUser } from 'next-auth/adapters';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdapterUser | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/currentUser');
        if (response.ok) {
          const user = await response.json();
          setCurrentUser(user);
        } else {
          console.warn('Failed to fetch user:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchCurrentUser();
  }, []);
  const handleMenu = () => {
    setMenu(!menu);
  };
  return (
    <nav className='relative z-10 w-full bg-primary text-gray-700'>
      <div className='flex justify-between items-center mx-5 sm:mx-10 lg:mx-20'>
        <div className='flex items-center text-2xl h-14'>
          <Link href='/'>Happy Market</Link>
        </div>
        <div className='text-2xl sm:hidden'>
          {menu === false ? <button onClick={handleMenu}>+</button> : <button onClick={handleMenu}>-</button>}
        </div>
        <div className='hidden sm:block'>
          <NavItem />
        </div>
      </div>
      <div className='block sm:hidden'>{menu === false ? null : <NavItem mobile />}</div>
    </nav>
  );
};

export default Navbar;
