import { cookies } from 'next/headers';
import StoriesCarousel from '../../components/StoriesCarousel';

// Sample stories data - replace this with your actual API call
const sampleStories = [
  {
    id: "1",
    title: "New Car Arrival",
    description: "Check out our latest addition to the fleet",
    url: "https://www.instagram.com/reel/ABC123",
    title_ar: "وصول سيارة جديدة",
    title_he: "הגעת מכונית חדשה",
    description_ar: "تحقق من أحدث إضافاتنا للأسطول",
    description_he: "בדוק את התוספת האחרונה לצי"
  },
  {
    id: "2",
    title: "Special Offers",
    description: "Limited time deals on premium vehicles",
    url: "https://www.instagram.com/reel/DEF456",
    title_ar: "عروض خاصة",
    title_he: "הצעות מיוחדות",
    description_ar: "صفقات لفترة محدودة على السيارات الفاخرة",
    description_he: "עסקאות לזמן מוגבל על רכבי פרימיום"
  }
];

async function getStories(locale: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stories`, {
      headers: {
        'Accept-Language': locale
      },
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch stories:', response.statusText);
      return sampleStories; // Fallback to sample data
    }

    const data = await response.json();
    if (!data || !data.stories) {
      console.error('Invalid API response structure');
      return sampleStories; // Fallback to sample data
    }

    return data.stories;
  } catch (error) {
    console.error('Error fetching stories:', error);
    return sampleStories; // Fallback to sample data
  }
}

export default async function StoriesPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'ar';
  
  const stories = await getStories(locale);

  return <StoriesCarousel initialStories={stories} />;
} 