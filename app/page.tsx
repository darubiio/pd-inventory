"use client";

import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

export default function Home() {
  const { user } = useUser();
  return (
    <div className="hero bg-base-300 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md space-y-6">
          <Image
            src="/pd-logo.jpeg"
            alt="Perdomo Distribuitor Logo"
            width={200}
            height={200}
            className="mx-auto block rounded-full shadow-lg transition duration-300 dark:invert dark:grayscale"
            priority
          />
          <h1 className="text-5xl font-bold">Welcome!</h1>
          <p className="text-lg">
            to <strong>Perdomo Distribuitor</strong> inventory management.
          </p>

          <p className="text-base">
            This platform is intended for internal use by Perdomo Distribuitor
            staff and collaborators.
          </p>

          <p className="text-base">
            If you landed here by mistake and are looking for our products or
            services, feel free to visit our online store:
            <br />
            <a
              className="text-primary font-semibold underline"
              href="https://www.perdomodistributor.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              👉 Go to PD Store
            </a>
          </p>

          <Link href="/dashboard">
            <button className="btn btn-md btn-primary">
              {user ? "Go to Dashboard" : "Login to Dashboard"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
