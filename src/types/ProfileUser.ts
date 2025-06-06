import { User } from './User';

export type ProfileUser = User & {
    role: 'customer' | 'provider';
};
  