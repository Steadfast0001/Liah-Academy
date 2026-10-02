import { createSignedFileUrl, isPrivateFileReference } from './private-files';

export function stripStudentPassword<T extends { password?: unknown }>(student: T): Omit<T, 'password'> {
  const { password: _password, ...safeStudent } = student;
  return safeStudent;
}

export function createStudentView<T extends {
  password?: unknown;
  document_url?: string;
  payment_proof_url?: string;
  documents?: unknown;
}>(student: T): Omit<T, 'password'> {
  const safeStudent = stripStudentPassword(student) as Omit<T, 'password'> & {
    document_url?: string;
    payment_proof_url?: string;
    documents?: unknown;
  };

  let documents = safeStudent.documents;
  if (!documents && typeof safeStudent.document_url === 'string' && safeStudent.document_url.trim().startsWith('[')) {
    try {
      documents = JSON.parse(safeStudent.document_url);
    } catch {}
  } else if (typeof documents === 'string') {
    try {
      documents = JSON.parse(documents);
    } catch {}
  }

  if (Array.isArray(documents)) {
    safeStudent.documents = documents.map(document => {
      if (!document || typeof document !== 'object') return document;
      const item = { ...document };
      if (typeof item.url === 'string' && isPrivateFileReference(item.url)) {
        item.url = createSignedFileUrl(item.url);
      }
      return item;
    });
    if ((!safeStudent.document_url || safeStudent.document_url.trim().startsWith('[')) && (safeStudent.documents as any[]).length > 0) {
      safeStudent.document_url = (safeStudent.documents as any[])[0].url;
    }
  }

  if (safeStudent.document_url && isPrivateFileReference(safeStudent.document_url)) {
    safeStudent.document_url = createSignedFileUrl(safeStudent.document_url);
  }
  if (safeStudent.payment_proof_url && isPrivateFileReference(safeStudent.payment_proof_url)) {
    safeStudent.payment_proof_url = createSignedFileUrl(safeStudent.payment_proof_url);
  }

  // Defensive sanitization: ensure file URIs never leak into admission_status
  const studentAny = safeStudent as any;
  if (typeof studentAny.admission_status === 'string') {
    if (studentAny.admission_status.startsWith('private-file://') || studentAny.admission_status.includes('/')) {
      if (!safeStudent.payment_proof_url && isPrivateFileReference(studentAny.admission_status)) {
        safeStudent.payment_proof_url = createSignedFileUrl(studentAny.admission_status);
      }
      studentAny.admission_status = 'Under Review';
    }
  }

  return safeStudent;
}