import crypto from 'crypto';
import {
  adminStore,
  ensureMySQLTables,
  getDatabaseSourceMode,
  getMySQLPool,
  type ChatMessageItem,
  type ChatSession
} from '@/lib/db';

type ChatMessageInput = {
  sender: 'user' | 'bot' | 'agent';
  text: string;
  sender_name?: string;
  id?: string;
  timestamp?: string;
};

type ChatSessionMeta = {
  user_name?: string;
  user_email?: string;
  user_phone?: string;
};

function parseSession(row: any): ChatSession {
  let messages = row.messages;
  if (typeof messages === 'string') {
    try {
      messages = JSON.parse(messages);
    } catch {
      messages = [];
    }
  }
  return {
    ...row,
    unread_admin: Boolean(row.unread_admin),
    unread_user: Boolean(row.unread_user),
    messages: Array.isArray(messages) ? messages : [],
    created_at: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at || ''),
    updated_at: row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at || '')
  } as ChatSession;
}

export async function getChatSession(id: string): Promise<ChatSession | null> {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.getChatSession(id) || null;

  await ensureMySQLTables();
  const [rows] = await getMySQLPool().execute('SELECT * FROM chat_sessions WHERE id = ?', [id]);
  const row = (rows as any[])[0];
  return row ? parseSession(row) : null;
}

export async function getChatSessions(): Promise<ChatSession[]> {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.getChatSessions();

  await ensureMySQLTables();
  const [rows] = await getMySQLPool().execute('SELECT * FROM chat_sessions ORDER BY updated_at DESC');
  return (rows as any[]).map(parseSession);
}

export async function saveChatMessage(
  sessionId: string,
  message: ChatMessageInput,
  sessionMeta?: ChatSessionMeta
): Promise<{ session: ChatSession; message: ChatMessageItem }> {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.saveChatMessage(sessionId, message, sessionMeta);

  await ensureMySQLTables();
  const now = new Date();
  const messageItem: ChatMessageItem = {
    id: message.id || `msg_${crypto.randomUUID()}`,
    sender: message.sender,
    sender_name: message.sender_name || (message.sender === 'user'
      ? sessionMeta?.user_name || 'Visitor'
      : message.sender === 'agent' ? 'Liah Support' : 'Liah Assist AI'),
    text: message.text,
    timestamp: message.timestamp || now.toISOString()
  };

  const pool = getMySQLPool();
  await pool.execute(
    `INSERT IGNORE INTO chat_sessions (id, user_name, user_email, user_phone, status, unread_admin, unread_user, last_message, messages)
     VALUES (?, ?, ?, ?, 'active', 0, 0, '', JSON_ARRAY())`,
    [sessionId, sessionMeta?.user_name || 'Website Visitor', sessionMeta?.user_email || '', sessionMeta?.user_phone || '']
  );
  const [rows] = await pool.execute('SELECT * FROM chat_sessions WHERE id = ?', [sessionId]);
  const session = parseSession((rows as any[])[0]);
  const messages = [...session.messages, messageItem];
  const userName = sessionMeta?.user_name && session.user_name === 'Website Visitor'
    ? sessionMeta.user_name
    : session.user_name || 'Website Visitor';
  const userEmail = sessionMeta?.user_email && !session.user_email ? sessionMeta.user_email : session.user_email || '';
  const userPhone = sessionMeta?.user_phone && !session.user_phone ? sessionMeta.user_phone : session.user_phone || '';
  const status = message.sender === 'user' ? 'active' : session.status;
  const unreadAdmin = message.sender === 'user' ? true : message.sender === 'agent' ? false : session.unread_admin;
  const unreadUser = message.sender === 'agent' ? true : session.unread_user;

  await pool.execute(
    `UPDATE chat_sessions SET user_name = ?, user_email = ?, user_phone = ?, status = ?,
     unread_admin = ?, unread_user = ?, last_message = ?, messages = ?, updated_at = ? WHERE id = ?`,
    [userName, userEmail, userPhone, status, Number(unreadAdmin), Number(unreadUser), message.text, JSON.stringify(messages), now, sessionId]
  );

  return {
    session: {
      ...session,
      user_name: userName,
      user_email: userEmail,
      user_phone: userPhone,
      status,
      unread_admin: unreadAdmin,
      unread_user: unreadUser,
      last_message: message.text,
      messages,
      updated_at: now.toISOString()
    },
    message: messageItem
  };
}

export async function sendAdminChatReply(
  sessionId: string,
  text: string,
  adminName: string
): Promise<{ session: ChatSession | null; message: ChatMessageItem | null }> {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.sendAdminChatReply(sessionId, text, adminName);

  await ensureMySQLTables();
  const pool = getMySQLPool();
  const [rows] = await pool.execute('SELECT * FROM chat_sessions WHERE id = ?', [sessionId]);
  const row = (rows as any[])[0];
  if (!row) {
    return { session: null, message: null };
  }

  const session = parseSession(row);
  const now = new Date();
  const message: ChatMessageItem = {
    id: `msg_adm_${crypto.randomUUID()}`,
    sender: 'agent',
    sender_name: adminName,
    text: text.trim(),
    timestamp: now.toISOString()
  };
  const messages = [...session.messages, message];
  await pool.execute(
    'UPDATE chat_sessions SET unread_admin = 0, unread_user = 1, last_message = ?, messages = ?, updated_at = ? WHERE id = ?',
    [message.text, JSON.stringify(messages), now, sessionId]
  );
  return {
    session: { ...session, unread_admin: false, unread_user: true, last_message: message.text, messages, updated_at: now.toISOString() },
    message
  };
}

export async function markChatSessionRead(id: string, reader: 'admin' | 'user'): Promise<boolean> {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.markChatSessionRead(id, reader);

  await ensureMySQLTables();
  const column = reader === 'admin' ? 'unread_admin' : 'unread_user';
  const [result] = await getMySQLPool().execute(`UPDATE chat_sessions SET ${column} = 0 WHERE id = ?`, [id]);
  return Number((result as { affectedRows: number }).affectedRows) > 0;
}

export async function closeChatSession(id: string): Promise<boolean> {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.closeChatSession(id);

  await ensureMySQLTables();
  const [result] = await getMySQLPool().execute(
    "UPDATE chat_sessions SET status = 'closed', updated_at = NOW() WHERE id = ?",
    [id]
  );
  return Number((result as { affectedRows: number }).affectedRows) > 0;
}

export async function deleteChatSession(id: string): Promise<boolean> {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.deleteChatSession(id);

  await ensureMySQLTables();
  const [result] = await getMySQLPool().execute('DELETE FROM chat_sessions WHERE id = ?', [id]);
  return Number((result as { affectedRows: number }).affectedRows) > 0;
}
