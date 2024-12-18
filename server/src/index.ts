import express, { Express } from 'express';
import cors from 'cors';
import helmet from "helmet";
import session from 'express-session';
import passport from 'passport';
import './auth/passport';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes/authRoutes';
import studentRoutes from './routes/userRoutes/studentRoutes';
import instructorRoutes from './routes/userRoutes/instructorRoutes';
import adminRoutes from './routes/adminRoutes/routes'
import config from './config/config';
import morgan from 'morgan';
import logger from './utils/logger';
import { HttpStatus } from './utils/httpStatusCodes';
import errorHandler from './middleware/errorHandler';
import './utils/logCleaner';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(
  session({
      secret: config.googleClientSecret || 'randomsecretkey76757',
      resave: false,
      saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: config.frontendUrl, 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(helmet());   //for req safety
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

app.use(cookieParser());


/* ROUTES */
app.use('/api/auth', userRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/instructor", instructorRoutes);
app.use('/api/admin',  adminRoutes); 


/* CONNECT TO MONGODB */
console.log("mongoUrl...", config.mongoUrl);
if (!config.mongoUrl) {
    throw new Error("MONGO_URL environment variable is not defined");
}
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log('MongoDB connected');
        app.listen(config.port, () => console.log(`Server running at: http://${config.host}:${config.port}`));
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB();


app.get('/', (req, res) => {
  console.log('Received request at /');
  res.status(HttpStatus.OK).json({ message: "hello from home", text: "hlo world" });
});

app.use(errorHandler);






// npm start  (development)
// npm run lint
