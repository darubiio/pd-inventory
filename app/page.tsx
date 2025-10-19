"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CubeIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div className="hero min-h-screen">
        <div className="hero-content text-center max-w-4xl px-6">
          <div className="space-y-12 pt-8 md:pt-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center md:items-end space-y-2 order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900">
                  Perdomo Distribuitor
                </h1>
                <p className="text-xl text-base-content/70 font-medium text-center md:text-right">
                  Inventory Management System
                </p>
              </div>

              <Image
                src="/pd-logo.jpeg"
                alt="Perdomo Distribuitor"
                width={120}
                height={120}
                className="rounded-full shadow-lg order-1 md:order-2"
                priority
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body items-center text-center p-6">
                  <ChartBarIcon className="w-12 h-12 text-primary mb-2" />
                  <h3 className="card-title text-lg">Inventory Tracking</h3>
                  <p className="text-sm text-base-content/70">
                    Track stock levels, item details and availability across
                    locations
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body items-center text-center p-6">
                  <CubeIcon className="w-12 h-12 text-secondary mb-2" />
                  <h3 className="card-title text-lg">Warehouse Management</h3>
                  <p className="text-sm text-base-content/70">
                    Efficiently organize multiple warehouse locations
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body items-center text-center p-6">
                  <ShieldCheckIcon className="w-12 h-12 text-accent mb-2" />
                  <h3 className="card-title text-lg">Secure Access</h3>
                  <p className="text-sm text-base-content/70">
                    Enterprise-grade security with role-based permissions
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-base-100/50 backdrop-blur-sm rounded-2xl p-8 border border-base-200">
                <h2 className="text-2xl font-bold mb-4">
                  Access Your Dashboard
                </h2>
                <p className="text-base-content/70 mb-6">
                  This platform is exclusively for Perdomo Distribuitor staff
                  and authorized collaborators. Log in to access your
                  personalized inventory management dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <button className="btn btn-lg group w-full sm:w-auto bg-blue-800 hover:bg-blue-900 text-white border-blue-700 hover:border-blue-800">
                      Access Dashboard
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="divider">Looking for our products?</div>

              <div className="bg-base-100/30 backdrop-blur-sm rounded-xl p-6 border border-base-200">
                <p className="text-base-content/70 mb-4">
                  If you&apos;re looking for our products and services, visit
                  our main store:
                </p>
                <a
                  href="https://www.perdomodistributor.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm group"
                >
                  Visit PD Store
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
