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
import { Card } from "../ui/components/layout/Card/Card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div className="hero min-h-screen">
        <div className="hero-content text-center max-w-4xl px-6">
          <div className="space-y-12 pt-8 md:pt-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              <div className="flex flex-col items-center md:items-end space-y-2 order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                  Perdomo Distribuitor
                </h1>
                <p className="text-xl text-slate-700 dark:text-slate-300 font-medium text-center md:text-right">
                  Inventory Management System
                </p>
              </div>

              <Image
                src="/pd-logo.jpeg"
                alt="Perdomo Distribuitor"
                width={120}
                height={120}
                className="rounded-full shadow-2xl ring-4 ring-blue-600/20 dark:ring-blue-400/30 order-1 md:order-2"
                priority
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700">
                <div className="card-body items-center text-center p-6">
                  <ChartBarIcon className="w-12 h-12 text-blue-700 dark:text-blue-400 mb-2" />
                  <Card.Title className="text-lg">
                    Inventory Tracking
                  </Card.Title>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Track stock levels, item details and availability across
                    locations
                  </p>
                </div>
              </div>

              <div className="card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-red-100 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-700">
                <div className="card-body items-center text-center p-6">
                  <CubeIcon className="w-12 h-12 text-red-600 dark:text-red-400 mb-2" />
                  <Card.Title className="text-lg">
                    Warehouse Management
                  </Card.Title>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Efficiently organize multiple warehouse locations
                  </p>
                </div>
              </div>

              <div className="card bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700">
                <div className="card-body items-center text-center p-6">
                  <ShieldCheckIcon className="w-12 h-12 text-blue-800 dark:text-blue-300 mb-2" />
                  <Card.Title className="text-lg">Secure Access</Card.Title>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Enterprise-grade security with role-based permissions
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 dark:from-blue-800 dark:to-blue-900 rounded-2xl p-8 shadow-2xl border border-blue-700 dark:border-blue-600">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Access Your Dashboard
                </h2>
                <p className="text-blue-100 dark:text-blue-200 mb-6">
                  This platform is exclusively for Perdomo Distribuitor staff
                  and authorized collaborators. Log in to access your
                  personalized inventory management dashboard.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <button className="btn btn-lg group w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-900 border-white hover:border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                      Access Dashboard
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="divider text-slate-600 dark:text-slate-400">
                Looking for our products?
              </div>

              <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  If you&apos;re looking for our products and services, visit
                  our main store:
                </p>
                <a
                  href="https://www.perdomodistributor.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm group border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-slate-900 transition-all duration-300"
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
