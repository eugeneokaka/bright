import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="p-8">
           <div className="flex justify-center mb-8">
             <h1 className="text-3xl font-semibold tracking-tight text-black">Bright</h1>
          </div>
          <SignUp 
            forceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
            appearance={{
              elements: {
                formButtonPrimary: "bg-brand-yellow hover:bg-brand-yellow-hover text-black font-medium text-sm normal-case transition-colors shadow-none",
                card: "shadow-none border-none p-0 bg-transparent",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white border border-zinc-200 hover:bg-zinc-50 text-black font-medium transition-colors shadow-none",
                footerActionLink: "text-black font-medium hover:text-brand-yellow-hover",
                formFieldLabel: "text-black font-medium",
                formFieldInput: "border border-zinc-200 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-colors bg-white text-black",
                dividerLine: "bg-zinc-200",
                dividerText: "text-zinc-500 font-medium",
                identityPreviewText: "text-black font-medium",
                identityPreviewEditButton: "text-zinc-500 hover:text-black",
                formResendCodeLink: "text-black font-medium hover:text-brand-yellow-hover",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
