import { RowDataPacket } from 'mysql2';

export interface BaseRow extends RowDataPacket {
  id: string;
  created_at: Date;
  updated_at: Date;
}
export interface UserRow extends BaseRow {
  name: string;
  email: string;
  image: string | null;
  hashed_password: string;
  email_verified: Date | null;
}

export interface SessionRow extends RowDataPacket {
  session_token: string;
  user_id: string;
  expires: Date;
}
