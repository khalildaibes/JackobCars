import dynamic from 'next/dynamic';

// Dynamically import the ComparisonPage with SSR disabled
const FindCarByPlate = dynamic(() => import('./FindCarByPlate'), { ssr: false });

export default function Comparison() {
  return <div className='py-40'><FindCarByPlate /></div>;
}
