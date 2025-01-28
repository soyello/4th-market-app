import { GiBoatFishing, GiFoodTruck, GiIsland, GiWindmill } from 'react-icons/gi';
import { MdOutlineVilla } from 'react-icons/md';
import { TbBeach, TbMountain } from 'react-icons/tb';

export const categories = [
  {
    label: '디지털 기기',
    path: 'digital',
    icon: TbBeach,
    description: '디지털 기기 카테고리입니다.',
  },
  {
    label: '생활 가전',
    path: 'appliances',
    icon: GiWindmill,
    description: '생활 가전 카테고리입니다.',
  },
  {
    label: '간식/가공식품',
    path: 'food',
    icon: GiFoodTruck,
    description: '간식/가공식품 카테고리입니다.',
  },
  {
    label: '가구/인테리어',
    path: 'interial',
    icon: MdOutlineVilla,
    description: '가구/인테리어 카테고리입니다.',
  },
  {
    label: '여성의류',
    path: 'women-clothing',
    icon: TbMountain,
    description: '여성 의류 카테고리입니다.',
  },
  {
    label: '뷰티/미용',
    path: 'beuty',
    icon: GiIsland,
    description: '뷰티/미용 카테고리입니다.',
  },
  {
    label: '스포츠/레저',
    path: 'sports',
    icon: GiBoatFishing,
    description: '스포츠/레저 카테고리입니.',
  },
];

const Categories = () => {
  return <div></div>;
};

export default Categories;
