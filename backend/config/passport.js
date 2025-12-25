import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/users/auth/google/callback`, // Route backend sẽ tạo ở bước sau

      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Kiểm tra xem user có googleId này chưa
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }

        // 2. Nếu chưa, kiểm tra xem email đã tồn tại chưa
        const userByEmail = await User.findOne({
          email: profile.emails[0].value,
        });
        if (userByEmail) {
          // Nếu email đã có (đăng ký truyền thống), ta cập nhật googleId vào user đó
          userByEmail.googleId = profile.id;
          // Cập nhật avatar nếu muốn
          // userByEmail.avatar = profile.photos[0].value;
          await userByEmail.save();
          return done(null, userByEmail);
        }

        // 3. Nếu chưa có gì, tạo user mới
        const newUser = await User.create({
          googleId: profile.id,
          fullName: profile.displayName,
          email: profile.emails[0].value,
          // Không cần password
          role: "customer",
          // avatar: profile.photos[0].value
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);
