import { Event } from "./event";

export type SignUpFormData = {
  username: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
  profile_picture?: File;
};

export type ConfirmationFormData = {
  code: string;
};

export interface UserData {
  username: string;
  profile_picture: string;
  phone_number: string;
  email: string;
  unread_tickets_count: number;
  unread_notifications_count: number;
  followers: number; // Updated to number based on API response
  friends: { _id: string; username: string; profile_picture: string }[];
  events: Event[];
  participants: { _id: string; username: string; profile_picture: string }[];
  total_attendees: number; // Added based on API response
  _id: string;
  id_org: string;
  e_account_id: string;
  n_account_id: string;
  liked_events: any[];
  is_org: boolean;
  organization_name?: string;
  details?: string;
  social_medias?: { social_link: string; platform: "instagram" | "facebook" | "tiktok" | "youtube" }[];
  has_pending_org_request?: boolean;
  premuim_status?: { features: string[]; name: string; price: number; monthly_tickets_limit: number };
  state?: string;
  owned_events?: number;
}

export interface SignUpResponse {
  success?: boolean;
  error?: { details?: string; message?: string; code?: string };
  respond?: { data: { user_data: UserData; tokens: any } | UserData };
  msg?: string;
  status: number;
  ok: boolean;
}
