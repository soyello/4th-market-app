import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

type navItemsProps =
  | { href: string; label: string; type: 'link' }
  | { label: string; type: 'button'; onClick: () => void };

const NavItem = ({ mobile }: { mobile?: boolean }) => {
  const { data: session, status } = useSession();
  console.log({ session }, status);

  const navItems: navItemsProps[] = [
    { href: '/admin', label: 'Admin', type: 'link' },
    { href: '/user', label: 'User', type: 'link' },
    session?.user
      ? { label: 'SignOut', type: 'button', onClick: () => console.log('bye') }
      : { label: 'SignIn', type: 'button', onClick: () => console.log('hello') },
  ];
  return (
    <ul className={`flex items-center justify-center gap-4 text-md w-full ${mobile && 'flex-col h-full'}`}>
      {navItems.map((item, index) => (
        <li key={index} className='py-2 border-b-2 border-selected cursor-pointer text-center'>
          {item.type === 'link' ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <button onClick={item.onClick}>{item.label}</button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default NavItem;
