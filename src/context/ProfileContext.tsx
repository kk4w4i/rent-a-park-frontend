import React, { createContext, useState, useEffect, useContext } from 'react';
import { ProfileUser } from '../types/ProfileUser';
import { dummyUser } from '../dummies/userResponse';
import { ProviderListing } from '@/types/ProviderListing';
import { Booking } from '@/types/Booking';
import { useAuthContext } from './AuthContext';

const USE_DUMMY_DATA = false;
const BASE_API_URL = 'http://localhost:8080/lb-service/api/v1';

type ProfileContextType = {
  profileUser: ProfileUser | null;
  providerListings: ProviderListing[];
  bookings: Booking[];
  switchRole: () => void;
  getListings: () => Promise<void>;
  getBookings: () => Promise<void>;
};

export const ProfileContext = createContext<ProfileContextType>({
  profileUser: null,
  providerListings: [],
  bookings: [],
  switchRole: () => {},
  getListings: async () => {
    throw new Error('getListings function not implemented');
  },
  getBookings: async () => {
    throw new Error('getBookings function not implemented');
  }
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  const initialUser = USE_DUMMY_DATA ? dummyUser : user!;
  const [profileUser, setProfileUser] = useState<ProfileUser>({
    ...initialUser,
    role: 'customer',
  });
  const [providerListings, setProviderListings] = useState<ProviderListing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const switchRole = () => {
    setProfileUser(prev =>
      prev.role === 'customer' && prev.is_provider
        ? { ...prev, role: 'provider' }
        : { ...prev, role: 'customer' }
    );
  };

  const getListings = async () => {
    if (profileUser.role === 'provider') {
        const response = await fetch(`${BASE_API_URL}/listings/provider`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (response.ok) {
          setProviderListings(data);
        }
        throw new Error('Failed to fetch listings');
    }
  }

  const getBookings = async () => {
    const response = await fetch(`${BASE_API_URL}/bookings/user`, {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.ok) {
      setBookings(data);
    }
    throw new Error('Failed to fetch bookings');
  }

  useEffect(() => {
    const baseUser = USE_DUMMY_DATA ? dummyUser : user!;
    setProfileUser({
      ...baseUser,
      role: 'customer',
    });
    // eslint-disable-next-line
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profileUser, providerListings, bookings, switchRole, getListings, getBookings }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => useContext(ProfileContext);
