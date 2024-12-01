import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import config from '../config/config';
import { UserService } from '../services/userService';
import { IUser } from '../interfaces/userInterface';


import { Strategy as OAuth2Strategy } from 'passport-google-oauth2'; 
import { log } from 'winston';

const userService = new UserService();

passport.use(
  new OAuth2Strategy({
    clientID: config.googleClientId || '',
    clientSecret: config.googleClientSecret || '',
    callbackURL: '/api/auth/google/callback',
    scope:["profile","email"]
},
async (accessToken: string, refreshToken: string, profile: Profile, done: (err: any, user?: any) => void) => {

  console.log("profile", profile);
  try {
    const googleId = profile.id;
    const firstName = profile.name?.givenName || "";
    const lastName = profile.name?.familyName || "";
    const email = profile.emails?.[0]?.value; 

    if (!email) {
      return done(new Error('Email not available from Google profile'));
    }

    // let user = await userRepository.findUserByGoogleid(profile.id);
    let user = await userService.findUserByEmail(email);
    console.log("user already in db, check if verified or not", user);
    if(user?.isVerified === false){
      user = await userService.updateUserVerification(email);
      console.log("user: ", user);
    }


    if(!user){
      console.log("the user not in db, create new user");
      
      user = { 
        googleId:profile.id,
        firstName,
        lastName, 
        email, 
        role: 'student', 
        isVerified: true 
      } as IUser;
      // user = {
      //   googleId: profile.id,
      //   firstName: firstName , // provide default values if undefined
      //   lastName: lastName ,
      //   email,
      //   role: 'student',
      //   isVerified: true,
      //   resetPasswordToken: null,
      //   resetPasswordExpiry: null,
      // } as IUser;
      let response = await userService.createUser(user); 
      console.log("user created in passport, response",response);
      user = response
      
    }

    console.log("user data after created or found in db==================================", user);
    

  return done(null,user)

  } catch (error) {
    console.log("error in passport 1",error);
    
    done(error, null);  
  }
}));


passport.serializeUser((user: any, done) => {
  console.log("serializeUser, user   1...", user);

  
  // done(null, user.id);  
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userService.findUserById(id); 
    console.log("deserializeUser , user   2...", user);
    
    done(null, user);
  } catch (error) {
    console.log("error in passport 3...",error);
    
    done(error, null);
  }
});























