import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Welcome to MailGenie
        </h1>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          Your AI-powered sales assistant
        </p>
      </div>

      <div className="w-full max-w-md">
        <SignIn path="/auth/sign-in" routing="path" signUpUrl="/auth/sign-up" />
      </div>
    </div>
  );
}
