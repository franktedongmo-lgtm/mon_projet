import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized: ({ req, token }) => {
      if (!token) return false;
      if (req.nextUrl.pathname.startsWith("/compte")) {
        return token.role === "CUSTOMER";
      }
      return token.role === "ADMIN";
    },
  },
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/products/:path*",
    "/admin/orders/:path*",
    "/admin/customers/:path*",
    "/admin/reviews/:path*",
    "/admin/settings/:path*",
    "/compte/dashboard/:path*",
    "/compte/commandes/:path*",
    "/compte/profil/:path*",
  ],
};
