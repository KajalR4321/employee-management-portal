import api from './API';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

export const authService = {
    /**
     * Authenticate user with credentials & store access token
     * @param {Object} credentials - { email, password }
     */
    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        const { token, user } = response.data;

        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }

        return { token, user };
    },

    /**
     * Clear active user session & remove stored tokens
     */
    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    /**
     * Retrieve currently saved user session
     */
    getCurrentUser() {
        const userStr = localStorage.getItem(USER_KEY);
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    /**
     * Get JWT bearer token for API authorization
     */
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    /**
     * Verify if a user session token exists
     */
    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;