import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quizzes/create/:path*",
    "/quizzes/:id/edit/:path*",
    "/quizzes/:id/attempt/:path*",
    "/attempts/:path*",
  ],
};
