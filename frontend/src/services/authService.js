import api from './API';

const TOKEN_KEY = 'jwt_token';
const USER_KEY = 'user_data';

export const authService = {

    async login(credentials) {
        try {
            const response = await api.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });

            const { token, user } = response.data;

            // Store token if backend provides one
            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
            }

            // Store user
            if (user) {
                localStorage.setItem(USER_KEY, JSON.stringify(user));
            }

            return {
                token: token || null,
                user: user || null
            };

        } catch (error) {
            console.error(
                'Login API Error:',
                error.response?.data || error.message
            );

            throw error;
        }
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    getCurrentUser() {
        const userStr = localStorage.getItem(USER_KEY);

        if (!userStr) {
            return null;
        }

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

export default authService;