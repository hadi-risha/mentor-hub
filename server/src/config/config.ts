import dotenv from 'dotenv';

dotenv.config(); 

interface Config {
  mongoUrl: string;
  port: number;
  host: string;
  emailUser: string;
  emailPass: string;
  googleClientId: string;
  googleClientSecret: string;
  adminEmail: string;
  adminPass: string;
  frontendUrl: string;

  jwtSecret: string;
  refreshTokenSecret: string;
  refreshTokenExpiry: string;
  accessTokenExpiry: string;

  awsBucketName: string;
  awsRegion: string;
  awsAccessKey: string;
  awsSecretKey: string;

  stripePublishableKey: string;
  stripeSecretKey: string;

}

const config: Config = {
  mongoUrl: process.env.MONGO_URL || '',
  port: Number(process.env.PORT) || 3001,
  host: process.env.HOST || 'localhost',
  emailUser: process.env.EMAIL_USER || '',
  emailPass: process.env.EMAIL_PASS || '',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPass: process.env.ADMIN_PASS || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || '',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || '',
  refreshTokenExpiry: '7d',
  accessTokenExpiry: '15m',

  awsBucketName: process.env.AWS_BUCKET_NAME || '',
  awsRegion: process.env.AWS_REGION || '',
  awsAccessKey: process.env.AWS_ACCESS_KEY || '',
  awsSecretKey: process.env.AWS_SECRET_KEY || '',

  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
};

export default config;
