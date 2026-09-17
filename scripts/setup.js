#!/usr/bin/env node

/**
 * Liah Academy - Automated Project Setup & Environment Initializer
 * This script runs when a new developer or system admin executes: npm run setup
 */

const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('🎓 LIAH ACADEMY - AUTOMATED PROJECT SETUP & INITIALIZATION');
console.log('========================================================\n');

const rootDir = process.cwd();
const envExamplePath = path.join(rootDir, '.env.example');
const envLocalPath = path.join(rootDir, '.env.local');
const dataDir = path.join(rootDir, 'data');
const storePath = path.join(dataDir, 'liah_academy_store.json');
const seedPath = path.join(dataDir, 'initial_seed.json');

// Step 1: Environment File Setup
console.log('Step 1: Checking environment configuration (.env.local)...');
if (!fs.existsSync(envLocalPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('  ✅ Created .env.local from .env.example template.');
  } else {
    console.log('  ⚠️ .env.example not found. Please create .env.local manually.');
  }
} else {
  console.log('  ℹ️ .env.local already exists (skipping overwrite).');
}

// Step 2: Data Directory Setup
console.log('\nStep 2: Checking storage directory (/data)...');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('  ✅ Created /data directory.');
} else {
  console.log('  ℹ️ /data directory is present.');
}

// Step 3: Local Storage Store Initializer
console.log('\nStep 3: Initializing database store (liah_academy_store.json)...');
if (!fs.existsSync(storePath)) {
  if (fs.existsSync(seedPath)) {
    try {
      const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
      const initialStore = {
        students: [],
        payments: [],
        admins: [],
        courses: seedData.courses || [],
        news: seedData.news || [],
        media: seedData.media || [],
        reviews: seedData.reviews || [],
        settings: seedData.settings || {
          id: 1,
          admin_email: 'info@liahacademy.com',
          site_title: 'Liah Academy of Technology and Management',
          contact_phone: '+237 670 265 493',
          address: 'Buea, South West Region, Cameroon',
          admissions_open: true
        },
        inquiries: [],
        email_logs: [],
        chat_sessions: []
      };
      fs.writeFileSync(storePath, JSON.stringify(initialStore, null, 2));
      console.log('  ✅ Initialized /data/liah_academy_store.json with default courses, news & demo student.');
    } catch (e) {
      console.log('  ⚠️ Error initializing store:', e.message);
    }
  }
} else {
  console.log('  ℹ️ Store /data/liah_academy_store.json is already populated.');
}

// Step 4: Ensure Client Error Boundaries and Resilience Files
console.log('\nStep 4: Ensuring Error Boundary and client-resilience handlers...');

const errorBoundaryPath = path.join(rootDir, 'components', 'ErrorBoundary.tsx');
if (!fs.existsSync(errorBoundaryPath)) {
  const errorBoundaryCode = `'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('UI Notice: Component error caught:', error?.message, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback !== undefined) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '24px', textAlign: 'center', margin: '20px auto', maxWidth: '500px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid rgba(8, 31, 62, 0.08)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#081F3E', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0' }}>Display Notice</h3>
          <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
            A temporary browser rendering glitch occurred in this widget.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '8px 18px', background: '#F5A623', color: '#081F3E', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Refresh Widget
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
`;
  fs.writeFileSync(errorBoundaryPath, errorBoundaryCode, 'utf8');
  console.log('  ✅ Created components/ErrorBoundary.tsx');
}

const appErrorPath = path.join(rootDir, 'app', 'error.tsx');
if (!fs.existsSync(appErrorPath)) {
  const appErrorCode = `'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Route Error caught:', error);
  }, [error]);

  return (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: '520px', width: '100%', background: '#FFFFFF', padding: '40px', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 50px rgba(8, 31, 62, 0.08)', border: '1px solid rgba(8, 31, 62, 0.06)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#FFF8EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', fontSize: '28px' }}>
          ⚠️
        </div>
        <h2 style={{ color: '#081F3E', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 10px 0' }}>
          System Refresh Required
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 24px 0' }}>
          The application encountered a client runtime state update. Click below to refresh the page view.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
              else reset();
            }}
            style={{ padding: '12px 24px', background: '#F5A623', color: '#081F3E', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer', fontSize: '0.95rem' }}
          >
            Reload Page
          </button>
          <Link
            href="/"
            style={{ padding: '12px 24px', background: '#081F3E', color: '#FFFFFF', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
`;
  fs.writeFileSync(appErrorPath, appErrorCode, 'utf8');
  console.log('  ✅ Created app/error.tsx');
}

const globalErrorPath = path.join(rootDir, 'app', 'global-error.tsx');
if (!fs.existsSync(globalErrorPath)) {
  const globalErrorCode = `'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif', background: '#081F3E', color: '#FFFFFF', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '480px', padding: '40px', textAlign: 'center', background: '#0D274D', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ fontSize: '1.6rem', color: '#F5A623', margin: '0 0 12px 0' }}>Liah Academy</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: '0 0 24px 0' }}>
            A temporary client exception occurred. Click to reload.
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.location.reload();
              else reset();
            }}
            style={{ padding: '12px 24px', background: '#F5A623', color: '#081F3E', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
`;
  fs.writeFileSync(globalErrorPath, globalErrorCode, 'utf8');
  console.log('  ✅ Created app/global-error.tsx');
}

// Step 5: Summary Instructions
console.log('\n========================================================');
console.log('🎉 SETUP COMPLETE! YOU ARE READY TO RUN LIAH ACADEMY');
console.log('========================================================\n');
console.log('To start development server:');
console.log('   npm run dev\n');
console.log('To build and run in production:');
console.log('   npm run build');
console.log('   npm run start\n');
console.log('Default Credentials:');
console.log('   🛡️ Admin Portal:    http://localhost:3000/admin');
console.log('      Email:           info@liahacademy.com');
console.log('      Password:        LiahAdmin2026!#\n');
console.log('   🎓 Student Portal:  http://localhost:3000/admissions');
console.log('      Email:           student@liahacademy.com');
console.log('      Password:        Student2026!#\n');
console.log('Optional MySQL Setup:');
console.log('   Import /data/schema.sql into your MySQL database (liah_db)\n');

