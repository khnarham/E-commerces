import Credentials from "next-auth/providers/credentials";
import NextAuth, { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcrypt';
import UserModel from "@/models/User";

interface UserData {
  username: string;
  email: string;
  isVerified: boolean;
  Password: string;
  verifyCode: string;
}

export const authOptions : AuthOptions = ({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        Password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials: any): Promise<UserData | null> {
        try {
          await dbConnect();

          if (!credentials?.email || !credentials?.Password) {
            throw new Error("Please provide both email and password");
          }

          const user = await UserModel.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("User is not verified");
          }

          const isPasswordCorrect = await bcrypt.compare(credentials.Password, user.Password);
          console.log("User:", user);
          console.log("Credentials:", credentials);
          console.log("Is Valid Password:", isPasswordCorrect);

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          return user;
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user } : any ) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
export default NextAuth(authOptions);