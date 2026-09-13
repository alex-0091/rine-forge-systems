import React from 'react';

export function BrandLogo({ className = "w-10 h-10" }) {
  return (
    <div className={`${className} rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-indigo-600 p-0.5 shadow-xl shadow-teal-500/20 relative group`}>
      <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
          <path d="M12 8H22C26.4183 8 30 11.5817 30 16C30 20.4183 26.4183 24 22 24H18V32H12V8Z" fill="url(#brand-grad)" />
          <path d="M22 24L29 32H21L16 26" stroke="#2DD4BF" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="brand-grad" x1="12" y1="8" x2="30" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2DD4BF" />
              <stop offset="0.5" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

export function OpenAILogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4947z" />
    </svg>
  );
}

export function GeminiLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 24C12 17.3726 17.3726 12 24 12C17.3726 12 12 6.62742 12 0C12 6.62742 6.62742 12 0 12C6.62742 12 12 17.3726 12 24Z" fill="url(#gemini-grad)" />
      <defs>
        <linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.5" stopColor="#818CF8" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AWSLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.8 14.7c-2.3 1.7-5.5 2.6-8.4 2.6-4 0-7.6-1.5-10.4-4-.2-.2-.1-.5.1-.6.3-.2.6-.1.8.1 2.5 2.2 5.7 3.6 9.4 3.6 2.6 0 5.5-.8 7.6-2.3.4-.3.9.1.9.6zM19.7 13.8c-.3-.4-1.8-.2-2.7.1-.3.1-.3-.2-.1-.4 1.4-.9 3.5-.6 3.8-.3.3.3.1 2.4-1.2 3.5-.2.2-.4.1-.3-.1.3-.7.7-2.3.5-2.8z" />
    </svg>
  );
}

export function StripeLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697.5 12.83.5 6.643.5 2.455 3.737 2.455 8.971c0 6.697 9.124 5.922 9.124 9.07 0 1.054-.925 1.488-2.227 1.488-2.585 0-5.46-1.282-7.241-2.296l-.916 5.618c1.782.975 4.793 1.649 7.842 1.649 6.452 0 10.963-3.057 10.963-8.623 0-7.391-9.024-6.305-9.024-9.727z" />
    </svg>
  );
}

export function PythonLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.914 0C5.82 0 6.2 2.65 6.2 2.65l.006 2.744h5.808v.823H3.83S0 5.76 0 11.875c0 6.117 3.344 5.904 3.344 5.904h1.996v-2.793s-.108-3.344 3.287-3.344h5.65v-.848H8.627s-3.23.16-3.23-3.15c0-3.31 2.875-3.21 2.875-3.21h9.324s2.617.29 2.617-2.618C20.213-.29 17.065 0 11.914 0zm-3.2 1.64a.974.974 0 1 1 0 1.948.974.974 0 0 1 0-1.948zM12.086 24c6.094 0 5.714-2.65 5.714-2.65l-.006-2.744h-5.808v-.823h8.184s3.83.457 3.83-5.658c0-6.117-3.344-5.904-3.344-5.904h-1.996v2.793s.108 3.344-3.287 3.344h-5.65v.848h5.65s3.23-.16 3.23 3.15c0 3.31-2.875 3.21-2.875 3.21H7.23s-2.617-.29-2.617 2.618C4.613 24.29 7.76 24 12.086 24zm3.2-1.64a.974.974 0 1 1 0-1.948.974.974 0 0 1 0 1.948z" />
    </svg>
  );
}

export function VercelLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 22.525H0l12-21.05 12 21.05z" />
    </svg>
  );
}

export function SupabaseLogo({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.234L.438 13.916a.396.396 0 0 0 .316.646H12v8.958a.396.396 0 0 0 .716.234l10.846-13.754a.396.396 0 0 0-.316-.646z" />
    </svg>
  );
}
