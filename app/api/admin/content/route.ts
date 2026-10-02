import { NextResponse } from 'next/server';
import db, { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';
import type { SiteSettings } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getMySQLSettings(): Promise<SiteSettings> {
  await ensureMySQLTables();
  const pool = getMySQLPool();
  let [rows] = await pool.execute('SELECT * FROM settings WHERE id = 1');
  if (!(rows as any[]).length) {
    const defaults = adminStore.getSettings();
    await pool.execute(
      `INSERT IGNORE INTO settings (id, admin_email, site_title, contact_phone, address, admissions_open, tiktok_url, maps_url, facebook_url, instagram_url)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [defaults.admin_email, defaults.site_title, defaults.contact_phone, defaults.address, defaults.admissions_open ? 1 : 0, defaults.tiktok_url || '', defaults.maps_url || '', defaults.facebook_url || '', defaults.instagram_url || '']
    );
    [rows] = await pool.execute('SELECT * FROM settings WHERE id = 1');
  }
  const row = (rows as any[])[0];
  if (!row) throw new Error('Settings record is unavailable.');
  return {
    admin_email: row.admin_email,
    site_title: row.site_title,
    contact_phone: row.contact_phone,
    address: row.address,
    admissions_open: Boolean(row.admissions_open),
    tiktok_url: row.tiktok_url || '',
    maps_url: row.maps_url || '',
    facebook_url: row.facebook_url || '',
    instagram_url: row.instagram_url || ''
  };
}

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    let courses;
    let news;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [courseRows] = await getMySQLPool().execute('SELECT * FROM courses ORDER BY id');
      const [newsRows] = await getMySQLPool().execute('SELECT * FROM news ORDER BY created_at DESC, id DESC');
      courses = courseRows;
      news = newsRows;
    } else {
      courses = adminStore.getCourses();
      news = adminStore.getNews();
    }
    const settings = getDatabaseSourceMode() === 'mysql'
      ? await getMySQLSettings()
      : adminStore.getSettings();

    return NextResponse.json({
      success: true,
      courses,
      news,
      settings
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to load content.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, data } = body;

    if (type === 'course') {
      let newCourse;
      if (getDatabaseSourceMode() === 'mysql') {
        await ensureMySQLTables();
        const [result] = await getMySQLPool().execute(
          `INSERT INTO courses (title, degree_type, program_type, study_format, duration, tuition_fee, description, modules, badge, school)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [data.title, data.degree_type, data.program_type, data.study_format || 'fulltime', data.duration || '2 Years', Number(data.tuition_fee) || 250000, data.description || '', data.modules || '', data.badge || 'Popular', data.school || 'School of Engineering']
        );
        const insertId = Number((result as { insertId: number }).insertId);
        const [rows] = await getMySQLPool().execute('SELECT * FROM courses WHERE id = ?', [insertId]);
        newCourse = (rows as any[])[0];
      } else {
        newCourse = adminStore.addCourse(data);
      }
      return NextResponse.json({ success: true, message: 'Course track added successfully.', data: newCourse });
    }

    if (type === 'news') {
      let newNews;
      if (getDatabaseSourceMode() === 'mysql') {
        await ensureMySQLTables();
        const [result] = await getMySQLPool().execute(
          'INSERT INTO news (title, category, date, image, excerpt, content) VALUES (?, ?, ?, ?, ?, ?)',
          [data.title, data.category || 'News', data.date || 'August 2026', data.image || '/assets/images/flyer_engineering.png', data.excerpt || '', data.content || '']
        );
        const insertId = Number((result as { insertId: number }).insertId);
        const [rows] = await getMySQLPool().execute('SELECT * FROM news WHERE id = ?', [insertId]);
        newNews = (rows as any[])[0];
      } else {
        newNews = adminStore.addNews(data);
      }
      return NextResponse.json({ success: true, message: 'Announcement created successfully.', data: newNews });
    }

    if (type === 'backup') {
      const result = db.createInstantBackup();
      return NextResponse.json({ success: true, message: 'Instant snapshot backup created successfully in data/backups/', data: result });
    }

    return NextResponse.json({ success: false, message: 'Unknown content type specified' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to save content.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'course') {
      let updated;
      if (getDatabaseSourceMode() === 'mysql') {
        const numericId = Number(id);
        if (!Number.isSafeInteger(numericId) || numericId <= 0) return NextResponse.json({ success: false, message: 'Invalid course ID.' }, { status: 400 });
        await ensureMySQLTables();
        const [existingRows] = await getMySQLPool().execute('SELECT * FROM courses WHERE id = ?', [numericId]);
        const existing = (existingRows as any[])[0];
        if (!existing) return NextResponse.json({ success: false, message: 'Course not found.' }, { status: 404 });
        const merged = { ...existing, ...data };
        await getMySQLPool().execute(
          `UPDATE courses SET title = ?, degree_type = ?, program_type = ?, study_format = ?, duration = ?,
           tuition_fee = ?, description = ?, modules = ?, badge = ?, school = ? WHERE id = ?`,
          [merged.title, merged.degree_type, merged.program_type, merged.study_format, merged.duration, Number(merged.tuition_fee) || 0, merged.description || '', merged.modules || '', merged.badge || '', merged.school || '', numericId]
        );
        const [updatedRows] = await getMySQLPool().execute('SELECT * FROM courses WHERE id = ?', [numericId]);
        updated = (updatedRows as any[])[0];
      } else {
        updated = adminStore.updateCourse(id, data);
      }
      return NextResponse.json({ success: true, message: 'Course track updated.', data: updated });
    }

    if (type === 'news') {
      let updated;
      if (getDatabaseSourceMode() === 'mysql') {
        const numericId = Number(id);
        if (!Number.isSafeInteger(numericId) || numericId <= 0) return NextResponse.json({ success: false, message: 'Invalid news ID.' }, { status: 400 });
        await ensureMySQLTables();
        const [existingRows] = await getMySQLPool().execute('SELECT * FROM news WHERE id = ?', [numericId]);
        const existing = (existingRows as any[])[0];
        if (!existing) return NextResponse.json({ success: false, message: 'Announcement not found.' }, { status: 404 });
        const merged = { ...existing, ...data };
        await getMySQLPool().execute(
          'UPDATE news SET title = ?, category = ?, date = ?, image = ?, excerpt = ?, content = ? WHERE id = ?',
          [merged.title, merged.category || 'News', merged.date || 'August 2026', merged.image || '', merged.excerpt || '', merged.content || '', numericId]
        );
        const [updatedRows] = await getMySQLPool().execute('SELECT * FROM news WHERE id = ?', [numericId]);
        updated = (updatedRows as any[])[0];
      } else {
        updated = adminStore.updateNews(id, data);
      }
      return NextResponse.json({ success: true, message: 'Announcement updated.', data: updated });
    }

    if (type === 'settings') {
      let updated;
      if (getDatabaseSourceMode() === 'mysql') {
        const current = await getMySQLSettings();
        updated = { ...current, ...data } as SiteSettings;
        await getMySQLPool().execute(
          `INSERT INTO settings (id, admin_email, site_title, contact_phone, address, admissions_open, tiktok_url, maps_url, facebook_url, instagram_url)
           VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE admin_email = VALUES(admin_email), site_title = VALUES(site_title),
           contact_phone = VALUES(contact_phone), address = VALUES(address), admissions_open = VALUES(admissions_open),
           tiktok_url = VALUES(tiktok_url), maps_url = VALUES(maps_url), facebook_url = VALUES(facebook_url), instagram_url = VALUES(instagram_url)`,
          [updated.admin_email, updated.site_title, updated.contact_phone, updated.address, updated.admissions_open ? 1 : 0, updated.tiktok_url || '', updated.maps_url || '', updated.facebook_url || '', updated.instagram_url || '']
        );
      } else {
        updated = adminStore.updateSettings(data);
      }
      return NextResponse.json({ success: true, message: 'Institutional settings updated successfully.', data: updated });
    }

    return NextResponse.json({ success: false, message: 'Unknown type for update' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to update content.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const idStr = searchParams.get('id');

    if (!idStr || !type) {
      return NextResponse.json({ success: false, message: 'Type and ID are required' }, { status: 400 });
    }

    const id = Number(idStr);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid content ID.' }, { status: 400 });
    }

    if (type === 'course') {
      if (getDatabaseSourceMode() === 'mysql') {
        await ensureMySQLTables();
        await getMySQLPool().execute('DELETE FROM courses WHERE id = ?', [id]);
      } else {
        adminStore.deleteCourse(id);
      }
      return NextResponse.json({ success: true, message: `Course #${id} removed.` });
    }

    if (type === 'news') {
      if (getDatabaseSourceMode() === 'mysql') {
        await ensureMySQLTables();
        await getMySQLPool().execute('DELETE FROM news WHERE id = ?', [id]);
      } else {
        adminStore.deleteNews(id);
      }
      return NextResponse.json({ success: true, message: `Announcement #${id} removed.` });
    }

    return NextResponse.json({ success: false, message: 'Invalid deletion type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to delete content.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
