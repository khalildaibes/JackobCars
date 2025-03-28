import Cookies from 'js-cookie';

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  confirmed: boolean;
  blocked: boolean;
  role: string;
}

interface AuthResponse {
  jwt: string;
  user: User;
}

export const authService = {
  async login(identifier: string, password: string): Promise<User> {
    try {
      const response = await fetch('/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login Error:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          requestBody: { identifier, password }
        });
        throw new Error(data.error?.message || 'Login failed');
      }
      console.log(`      ${JSON.stringify(data)}`);

      Cookies.set('token', data.jwt, { expires: 7 });
      Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

      return data.user;
    } catch (error) {
      console.error('Login Exception:', error);
      throw error;
    }
  },

  async register(
username: string, email: string, password: string, name: string  ): Promise<User> {
    try {
      // Basic validation
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }

      const requestBody = {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password,
        name: name.trim()
      };
      console.log(` requestBody ${JSON.stringify(requestBody)}`);

      const response = await fetch('/api/auth/local/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      console.log(` response ${JSON.stringify(response)}`);

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || 'Registration failed';
        throw new Error(errorMessage);
      }

      if (data.jwt && data.user) {
        Cookies.set('token', data.jwt, { expires: 7 });
        Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
      }

      return data.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Update User Error:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          userId,
          userData
        });
        throw new Error(data.error?.message || 'Failed to update user');
      }

      Cookies.set('user', JSON.stringify(data), { expires: 7 });
      return data;
    } catch (error) {
      console.error('Update User Exception:', error);
      throw error;
    }
  },

  logout() {
    Cookies.remove('token');
    Cookies.remove('user');
  },

  getCurrentUser(): User | null {
    const userCookie = Cookies.get('user');
    return userCookie ? JSON.parse(userCookie) : null;
  }
}; 