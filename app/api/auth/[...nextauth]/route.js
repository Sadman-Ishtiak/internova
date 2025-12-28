import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    // 1. Google Login
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        await dbConnect();
        let user = await User.findOne({ email: profile.email });
        
        // Create user if they don't exist
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
          companyId: user.companyId
        };
      }
    }),

    // 2. Email/Password Login
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

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id || user.id;
        token.role = user.role;
        token.companyId = user.companyId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.companyId = token.companyId;
      return session;
    }
  },
  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };