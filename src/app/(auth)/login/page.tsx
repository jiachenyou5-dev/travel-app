import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold text-center text-foreground mb-8">
            登录
          </h1>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            还没有账号？
            <Link href="/register" className="text-primary hover:underline ml-1">
              注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
