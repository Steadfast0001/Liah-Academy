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
        email_logs: []
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

// Step 4: Summary Instructions
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
