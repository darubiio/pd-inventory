"use client";

import React from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export const ContactLinks = ({
  email,
  phone,
}: {
  email?: string;
  phone?: string;
}) => (
  <>
    {email && (
      <li
        className="font-semibold opacity-70 flex gap-x-2"
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `mailto:${email}`;
        }}
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
      >
        <span className="link link-hover flex gap-x-2 opacity-80 hover:opacity-100">
          <EnvelopeIcon height={18} /> {email}
        </span>
      </li>
    )}
    {phone && (
      <li
        className="font-semibold opacity-70 flex gap-x-2"
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = `tel:${phone}`;
        }}
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
      >
        <span className="link link-hover flex gap-x-2 opacity-80 hover:opacity-100">
          <PhoneIcon height={18} /> {phone}
        </span>
      </li>
    )}
  </>
);
