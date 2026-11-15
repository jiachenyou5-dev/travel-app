import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "./login-form";

export default function AuthPage() {
  return (
    <div className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:py-20">
      <div className="relative hidden min-h-[510px] flex-col justify-between overflow-hidden rounded-xl bg-[var(--clay-lavender)] p-10 lg:flex">
        <h2 className="relative z-10 text-[40px] leading-tight font-medium tracking-tight text-[#0a0a0a]">每一次出发，<br />都有新的故事。</h2>
        <div className="absolute inset-x-0 bottom-0 h-[360px]"><Image src="/images/clay/hero.png" loading="eager" alt="黏土旅行世界插画" fill sizes="540px" className="object-contain" /></div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-[36px] font-medium tracking-tight">欢迎回来。</h1>
        <p className="mt-3 mb-9 text-sm text-muted-foreground">登录账号，继续收藏与记录你的旅程。</p>
        <LoginForm />
        <p className="mt-7 text-sm text-muted-foreground">还没有账号？<Link href="/register" className="ml-2 border-b border-foreground pb-0.5 text-foreground">注册</Link></p>
      </div>
    </div>
  );
}
