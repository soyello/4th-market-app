import { AdapterSession, AdapterUser } from 'next-auth/adapters';
import pool from './db';
import { SessionRow, UserRow } from '@/helper/row';
import { mapToAdapterSession, mapToAdapterUser } from '@/helper/mapper';
import { ResultSetHeader } from 'mysql2';

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

const MySQLAdapter = {
  async getUser(email: string): Promise<AdapterUser | null> {
    if (!email) {
      throw new Error('Email must be provided.');
    }
    try {
      const [rows] = await pool.query<UserRow[]>(
        'SELECT id, name, email, image, email_verified, hashed_password, user_type, created_at, updated_at FROM users WHERE email = ?',
        [email]
      );
      console.log('뭔데뭔데', rows[0]);
      return rows[0] ? mapToAdapterUser(rows[0]) : null;
    } catch (error) {
      console.error('Error fetching user by Email:', error);
      throw new Error('Failed fetch user.');
    }
  },
  async createUser(user: Omit<AdapterUser, 'id' | 'emailVerified' | 'role'>): Promise<AdapterUser> {
    const { name, email, hashedPassword } = user;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO users (name, email, hashed_password) VALUES (?,?,?)',
      [name, email, hashedPassword]
    );
    return {
      id: result.insertId.toString(),
      name,
      email,
      image: null,
      role: 'User',
      hashedPassword,
      emailVerified: null,
    };
  },
  async updateUser(user: Nullable<AdapterUser> & { email: string }): Promise<AdapterUser> {
    const { name, email, image, role } = user;
    if (!email) {
      throw new Error('User ID is required for updating.');
    }
    try {
      const updates = { name, image, user_type: role };
      const keys = Object.keys(updates).filter((key) => updates[key as keyof typeof updates] !== undefined);
      if (keys.length === 0) {
        throw new Error('No fields to update. Provide at least one field.');
      }
      const fields = keys.map((key) => `${key}=?`).join(', ');
      const values = keys.map((key) => updates[key as keyof typeof updates]);

      await pool.query(`UPDATE users SET ${fields} WHERE email=?`, [...values, email]);

      const [rows] = await pool.query<UserRow[]>(
        'SELECT id, name, email, image, ,user_type, created_at, updated_at, email_verified FROM users WHERE email=?',
        [email]
      );
      if (!rows[0]) {
        throw new Error(`User with Email: ${email} not found after update.`);
      }
      return mapToAdapterUser(rows[0]);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user.');
    }
  },
  async deleteUser(email: string): Promise<void> {
    await pool.query('DELETE FROM uses WHERE email=?', [email]);
  },
  async getSessionAndUser(sessionToken: string): Promise<{
    session: AdapterSession;
    user: AdapterUser;
  } | null> {
    if (!sessionToken) {
      throw new Error('sessionToken must be required.');
    }
    try {
      const [results] = await pool.query<(SessionRow & UserRow)[]>(
        `SELECT
            s.session_token AS session_token,
            s.user_id AS user_id,
            s.expires AS expires,
            u.id AS id,
            u.name AS name,
            u.email AS email,
            u.image AS image,
            u.user_type AS user_type,
            u.created_at AS created_at,
            u.updated_at AS updated_at,
            u.email_verified AS email_verified
          FROM sessions AS s
          LEFT JOIN users AS u ON s.user_id = u.id
          WHERE s.session_token = ?`,
        [sessionToken]
      );
      const result = results[0];
      if (!result) return null;
      const session = mapToAdapterSession(result);
      const user = mapToAdapterUser(result);
      return { session, user };
    } catch (error) {
      console.error('Error fetching session and user:', error);
      throw new Error('Failed to fetching session and user.');
    }
  },
  async createSession(session: AdapterSession): Promise<AdapterSession> {
    const { sessionToken, userId, expires } = session;
    if (!sessionToken || !userId || !expires) {
      throw new Error('All fields (sessionToken, userId, expires) are required to create a session');
    }
    try {
      await pool.query('INSERT INTO sessions (session_token, user_id, expires) VALUES (?,?,?)', [
        sessionToken,
        userId,
        expires,
      ]);
      const [rows] = await pool.query<SessionRow[]>(
        'SELECT session_token, user_id, exprires FROM sessions WHERE session_token=?',
        [sessionToken]
      );
      const result = rows[0];
      if (!result) {
        throw new Error('Failed to retrieve the created session from the database.');
      }
      return mapToAdapterSession(result);
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Failed to create session.');
    }
  },
  async updateSession(
    session: Nullable<AdapterSession> & {
      sessionToken: string;
    }
  ): Promise<AdapterSession | null> {
    const { sessionToken, userId, expires } = session;
    if (!sessionToken) {
      throw new Error('Session token is required to update a session.');
    }
    try {
      const updates = { user_id: userId, expires };
      const keys = Object.keys(updates).filter((key) => updates[key as keyof typeof updates] !== undefined);
      if (keys.length === 0) {
        throw new Error('No fields to update. Provide at least on fields.');
      }
      const fields = keys.map((key) => `${key}=?`).join(', ');
      const values = keys.map((key) => updates[key as keyof typeof updates]);

      const query = `UPDATE sessions SET ${fields} WHERE session_token=?`;

      await pool.query(query, [...values, sessionToken]);

      const [rows] = await pool.query<SessionRow[]>(
        'SELECT session_token, user_id, expires FROM sessions WHERE session_token = ?',
        [sessionToken]
      );
      if (!rows.length) {
        return null;
      }
      return mapToAdapterSession(rows[0]);
    } catch (error) {
      console.error(`Error updating session for token ${sessionToken}:`, error);
      throw new Error('Failed to update session.');
    }
  },
  async deleteSession(sessionToken: string): Promise<void> {
    if (!sessionToken) {
      throw new Error('Session token is required to delete a session.');
    }
    try {
      await pool.query('DELETE FROM sessions WHERE session_token=?', [sessionToken]);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error('Failed to delete session.');
    }
  },
};

export default MySQLAdapter;
