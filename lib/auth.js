import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await dbConnect();
        let user = await User.findOne({ email: profile.email });
        
        if (!user) {
          user = await User.create({
            name: profile.name,
            email: profile.email,
            profileImage: profile.picture,
            role: 'user',
            isBanned: false
          });
        }
        
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.profileImage,
          role: user.role,
          companyId: user.companyId?.toString()?.toString()
        };
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user) throw new Error("User not found");
        if (user.isBanned) throw new Error("Account is banned");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        // Return normalized user object
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.profileImage,
          role: user.role,
          companyId: user.companyId?.toString()
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      } 
      // Subsequent requests - refresh role/status from DB
      else if (token.email) {
        await dbConnect();
        const freshUser = await User.findOne({ email: token.email });
        if (freshUser) {
          token.role = freshUser.role;
          token.companyId = freshUser.companyId?.toString();
          token.isBanned = freshUser.isBanned; // Check ban status too
          
          // If banned, invalidate token
          if (freshUser.isBanned) {
            return null;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (!token) {
        return null; // Return null if token is invalid (banned user)
      }
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
};