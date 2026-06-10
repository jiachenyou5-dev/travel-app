import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <h1 className="text-2xl font-bold text-center text-foreground mb-8">
            注册
          </h1>
          <RegisterForm />
          <p className="text-center text-sm text-muted-foreground mt-6">
            已有账号？
            <Link href="/login" className="text-primary hover:underline ml-1">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
