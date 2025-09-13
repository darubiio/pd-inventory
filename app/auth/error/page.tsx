import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="hero bg-base-300 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-6">
          <h1 className="text-4xl font-bold text-error">
            Authentication Error
          </h1>
          <p className="text-lg">
            There was an error during the authentication process.
          </p>
          <p className="text-base">
            Please try logging in again or contact support if the problem
            persists.
          </p>
          <div className="space-x-4">
            <Link href="/auth/login">
              <button className="btn btn-primary">Try Again</button>
            </Link>
            <Link href="/">
              <button className="btn btn-ghost">Go Home</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
