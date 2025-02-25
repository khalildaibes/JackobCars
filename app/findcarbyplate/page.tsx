import dynamic from 'next/dynamic';

// Dynamically import the ComparisonPage with SSR disabled
const FindCarByPlate = dynamic(() => import('./FindCarByPlate'), { ssr: false });

export default function Comparison() {
  return (
    <div className='py-40 items-center justify-center flex items-center justify-center min-w-full'>
  <div className='max-w-[80%]'>
    <FindCarByPlate />
    </div>
    </div>
    );
}
