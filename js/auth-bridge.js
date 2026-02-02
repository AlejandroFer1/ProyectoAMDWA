import { logoutUser } from './auth.js';

// Expose logout to window for the onclick handler in HTML
window.logout = logoutUser;
