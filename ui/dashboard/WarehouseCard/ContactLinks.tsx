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
      <li className="font-semibold opacity-70 flex gap-x-2" tabIndex={0}>
        <span className="flex gap-x-2 opacity-80">
          <EnvelopeIcon height={18} /> {email}
        </span>
      </li>
    )}
    {phone && (
      <li className="font-semibold opacity-70 flex gap-x-2" tabIndex={0}>
        <span className="flex gap-x-2 opacity-80">
          <PhoneIcon height={18} /> {phone}
        </span>
      </li>
    )}
  </>
);
