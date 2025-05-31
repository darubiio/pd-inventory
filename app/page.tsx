"use client";

import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  return (
    <div className="hero bg-base-300 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
           <Link href="/dashboard">
            <button className="btn btn-md btn-primary">
              Go to Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
