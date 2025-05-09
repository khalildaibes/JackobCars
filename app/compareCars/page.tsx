import dynamic from 'next/dynamic';

// Dynamically import the ComparisonPage with SSR disabled
const ComparisonPage = dynamic(() => import('./ComparisonPage'));

export default function Comparison() {
  return <ComparisonPage />;
}
