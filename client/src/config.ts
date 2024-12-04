const config = {
  backendUrl: process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/api",
  googleAuthCallback: process.env.REACT_APP_GOOGLE_AUTH_CALLBACK || "http://localhost:3001/api/auth/google/callback",
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  frontendUrl: process.env.FRONTEND_URL ,

  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',

  zegeCloudAppId: process.env.ZEGOCLOUD_APP_ID || 516395584,
  zegeCloudServerSecret: process.env.ZEGOCLOUD_SERVER_SECRET || 'aa898036c49ff20446f7dde85d98d26a',
};

export default config;


