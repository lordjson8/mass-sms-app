import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "Login - Mass SMS",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/protected/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mass SMS</h1>
            <p className="text-gray-600 mt-2">Enterprise SMS Platform</p>
          </div>
          <LoginForm />
        </div>
        <p className="text-center text-white text-sm mt-4">
          Demo credentials: admin@example.com / password
        </p>
      </div>
    </div>
  );
}
