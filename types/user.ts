// types/user.ts
export type BaseUser = {
    id: string;
    email: string;
    username: string;
    phone_number?: string;
    // ... other common user fields
  };
  
  export type SocialMedia = {
    platform: string;
    url: string;
  };
  
  export type OrganizerProfile = {
    is_org: boolean;
    organization_name: string;
    details: string;
    social_medias: SocialMedia[];
  };
  
  export type UserData = BaseUser & {
    is_org?: boolean; // Optional organizer flag
    organizer_profile?: OrganizerProfile; // Optional nested organizer data
  };