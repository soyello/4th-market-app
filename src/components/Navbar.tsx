import Link from 'next/link';
import React, { useState } from 'react';
import NavItem from './NavItem';

const Navbar = () => {
  const [menu, setMenu] = useState(false);
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
