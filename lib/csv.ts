// --- Types ---

export interface RawApplicantRecord {
  id: string | number;
  matricule?: string;
  fullName: string;
  email: string;
  phone: string;
  degreeLevel: string;
  programTrack: string;
  studyFormat: string;
  admissionStatus: string;
  paymentStatus: string;
  createdAt: string | Date;
}

export interface SanitizedApplicantRow {
  id: number | string;
  matricule: string;
  full_name: string;
  email: string;
  phone_number: string;
  degree_level: string;
  program_track: string;
  study_format: string;
  admission_status: string;
  payment_status: string;
  created_at: string;
}

// --- Sanitization Utilities ---

/**
 * Strips rogue newlines, carriage returns, and excess whitespace.
 */
export function cleanString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Formats name to Title Case (e.g. "james smith" -> "James Smith").
 */
export function toTitleCase(value: string): string {
  const cleaned = cleanString(value);
  return cleaned
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Removes redundant degree abbreviations from the program name.
 * e.g., Program: "Software Engineering HND", Degree: "HND" -> "Software Engineering"
 */
export function normalizeProgramTrack(programTrack: string, degreeLevel: string): string {
  const cleanedProgram = cleanString(programTrack);
  const cleanedDegree = cleanString(degreeLevel);

  if (!cleanedDegree || !cleanedProgram) return cleanedProgram;

  const regex = new RegExp(`\\b${cleanedDegree}\\b`, 'gi');
  return cleanedProgram.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Normalizes study format (e.g. "oncampus" -> "On-Campus", "online" -> "Online").
 */
export function normalizeStudyFormat(format: string): string {
  const clean = cleanString(format).toLowerCase().replace(/[-_\s]/g, '');
  if (clean === 'oncampus') return 'On-Campus';
  if (clean === 'online') return 'Online';
  if (clean === 'hybrid') return 'Hybrid';
  return toTitleCase(format);
}

/**
 * Converts any valid Date or timestamp string into ISO 8601 UTC string.
 */
export function normalizeDate(dateVal: string | Date): string {
  if (!dateVal) return '';
  const parsed = new Date(dateVal);
  return isNaN(parsed.getTime()) ? cleanString(dateVal) : parsed.toISOString();
}

/**
 * Normalizes phone numbers (ensures standard format without linebreaks/spaces).
 */
export function normalizePhone(phone: string): string {
  const cleaned = cleanString(phone);
  return cleaned.replace(/[\s\-()]/g, '');
}

// --- Transformer Function ---

/**
 * Sanitizes and normalizes a single raw applicant record.
 */
export function sanitizeApplicantRecord(raw: RawApplicantRecord): SanitizedApplicantRow {
  const degreeLevel = cleanString(raw.degreeLevel).toUpperCase();

  return {
    id: raw.id,
    matricule: cleanString(raw.matricule || `HND26SW${String(raw.id).padStart(3, '0')}`),
    full_name: toTitleCase(raw.fullName),
    email: cleanString(raw.email).toLowerCase(),
    phone_number: normalizePhone(raw.phone),
    degree_level: degreeLevel,
    program_track: normalizeProgramTrack(raw.programTrack, degreeLevel),
    study_format: normalizeStudyFormat(raw.studyFormat),
    admission_status: toTitleCase(raw.admissionStatus),
    payment_status: toTitleCase(raw.paymentStatus),
    created_at: normalizeDate(raw.createdAt),
  };
}

// --- CSV Exporters ---

export const CSV_COLUMNS: Array<{ key: keyof SanitizedApplicantRow; header: string }> = [
  { key: 'id', header: 'id' },
  { key: 'matricule', header: 'matricule' },
  { key: 'full_name', header: 'full_name' },
  { key: 'email', header: 'email' },
  { key: 'phone_number', header: 'phone_number' },
  { key: 'degree_level', header: 'degree_level' },
  { key: 'program_track', header: 'program_track' },
  { key: 'study_format', header: 'study_format' },
  { key: 'admission_status', header: 'admission_status' },
  { key: 'payment_status', header: 'payment_status' },
  { key: 'created_at', header: 'created_at' },
];

/**
 * Escapes a cell value per RFC 4180 rules.
 */
function escapeCSVCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Converts a dataset into a sanitized CSV string (in-memory) with UTF-8 BOM and Windows CRLF (\r\n).
 */
export function exportApplicantsToCSVString(records: RawApplicantRecord[]): string {
  const sanitized = records.map(sanitizeApplicantRecord);
  const headerRow = CSV_COLUMNS.map(c => `"${c.header}"`).join(',');
  const dataRows = sanitized.map(row => 
    CSV_COLUMNS.map(col => escapeCSVCell(row[col.key])).join(',')
  );

  // Prepend UTF-8 BOM for Excel compatibility
  return '\uFEFF' + [headerRow, ...dataRows].join('\r\n');
}
