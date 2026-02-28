import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8">
          <div className="flex justify-center mb-8">
             <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Bright</h1>
          </div>
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: "bg-zinc-900 hover:bg-zinc-800 text-sm normal-case",
                card: "shadow-none border-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-zinc-200 hover:bg-zinc-50 text-zinc-600",
                footerActionLink: "text-zinc-900 font-semibold hover:text-zinc-700",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
