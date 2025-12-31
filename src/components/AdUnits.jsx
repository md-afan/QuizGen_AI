import AdsenseAd from './AdsenseAd';

// Ad unit for Homepage (Leaderboard)
export const HomepageAd = () => (
  <div className="w-full max-w-4xl mx-auto my-8">
    <div className="text-center text-xs text-gray-500 mb-1">Advertisement</div>
    <AdsenseAd
      slot="2929289514348107" // Replace with your actual ad slot ID
      format="horizontal"
      style={{ width: '100%', height: '90px' }}
    />
  </div>
);

// Ad unit for Quiz Creation (Medium Rectangle)
export const QuizCreationAd = () => (
  <div className="my-6 text-center">
    <div className="text-center text-xs text-gray-500 mb-1">Advertisement</div>
    <AdsenseAd
      slot="2929289514348107" // Replace with your actual ad slot ID
      format="rectangle"
      style={{ width: '300px', height: '250px', margin: '0 auto' }}
    />
  </div>
);

// Ad unit for Reports (In-Article)
export const ReportAd = () => (
  <div className="my-8">
    <div className="text-center text-xs text-gray-500 mb-1">Advertisement</div>
    <AdsenseAd
      slot="2929289514348107" // Replace with your actual ad slot ID
      format="fluid"
      style={{ display: 'block', textAlign: 'center' }}
    />
  </div>
);

// Sidebar ad (for any page)
export const SidebarAd = () => (
  <div className="sticky top-4">
    <div className="text-center text-xs text-gray-500 mb-1">Sponsored</div>
    <AdsenseAd
      slot="2929289514348107" // Replace with your actual ad slot ID
      format="vertical"
      style={{ width: '160px', height: '600px', margin: '0 auto' }}
    />
  </div>
);