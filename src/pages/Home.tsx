import { useState } from 'react';
import ModernMap from '../customComponents/Map';
import SearchBar from '../customComponents/SearchBar';
import { Button } from '@/components/ui/button';
import { SearchProvider, useSearchContext } from '@/context/SearchContext';
import Filter from '@/customComponents/Filter';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

export default function Home() {
  const [mapState, setMapState] = useState({
    center: [-27.4698, 153.0251] as [number, number],
    zoom: 13
  });
  const { listings } = useSearchContext();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  return (
    <SearchProvider>

      <div>
        <div className='fixed flex justify-center items-center w-full p-10 z-10'>
          <div className='w-full flex justify-center items-center gap-5 drop-shadow-xl'>
            <SearchBar onSelect={(lat, lon) => setMapState({ center: [lat, lon], zoom: mapState.zoom })} />
            <div className='flex gap-5'>
              <Filter
                mapState={mapState}
              />
              {user && (
                <Button onClick={() => navigate('/profile')} className='rounded-full aspect-square'>
                  @{user.username}
                </Button>
              )}
              {!user && (
                <Button onClick={() => navigate('/sign-in')} className='rounded-full bg-red-800 text-white hover:bg-red-800/70'>
                  Sign in
                </Button>
              )}
              
            </div>
          </div>  
        </div>
        <div>
          <ModernMap
            center={mapState.center}
            listings={listings}
            onViewportChange={setMapState}
          />
        </div>
      </div>
    </SearchProvider>
    
  );
}