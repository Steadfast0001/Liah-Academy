export interface CampayCollectRequest {
  amount: number | string;
  from: string;
  description: string;
  externalReference?: string;
}

export interface CampayCollectResponse {
  reference: string;
  ussd_code?: string;
  operator?: string;
  status?: string;
}

export interface CampayTransactionStatus {
  reference: string;
  status: 'SUCCESSFUL' | 'FAILED' | 'PENDING' | string;
  amount: number;
  currency: string;
  operator?: string;
  code?: string;
  operator_reference?: string;
  endpoint_cause?: string;
}

// Format phone number to international standard (2376XXXXXXXX)
export function normalizeCameroonPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('237') && cleaned.length === 12) {
    return cleaned;
  }
  if (cleaned.length === 9) {
    return `237${cleaned}`;
  }
  if (cleaned.length === 8) {
    return `2376${cleaned}`;
  }
  return cleaned.startsWith('237') ? cleaned : `237${cleaned}`;
}

const getBaseUrl = () => {
  const env = process.env.CAMPAY_ENV || 'demo';
  return env === 'production' ? 'https://www.campay.net/api/' : 'https://demo.campay.net/api/';
};

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

// Obtain authorization token from credentials or permanent token
export async function getCampayToken(): Promise<string> {
  // If permanent token exists, prioritize it
  if (process.env.CAMPAY_PERMANENT_ACCESS_TOKEN) {
    return process.env.CAMPAY_PERMANENT_ACCESS_TOKEN;
  }

  // Check in-memory cached token
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const username = process.env.CAMPAY_USERNAME;
  const password = process.env.CAMPAY_PASSWORD;

  if (!username || !password) {
    throw new Error('Campay credentials (CAMPAY_USERNAME / CAMPAY_PASSWORD) are not configured.');
  }

  const res = await fetch(`${getBaseUrl()}token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(`Failed to authenticate with Campay: ${errData.detail || res.statusText}`);
  }

  const data = await res.json();
  cachedToken = data.token;
  tokenExpiresAt = Date.now() + 1800 * 1000; // 30 mins
  return data.token;
}

// Request Payment Collection (Triggers USSD Prompt to student's phone)
export async function requestCampayPayment(params: CampayCollectRequest): Promise<CampayCollectResponse> {
  const token = await getCampayToken();
  const phone = normalizeCameroonPhone(params.from);
  const amount = String(Math.round(Number(params.amount)));

  const payload = {
    amount,
    currency: 'XAF',
    from: phone,
    description: params.description || 'Liah Academy Tuition / Registration Deposit',
    external_reference: params.externalReference || `LIAH-${Date.now()}`
  };

  const res = await fetch(`${getBaseUrl()}collect/`, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.detail || `Campay collection error (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data;
}

// Poll Transaction Status
export async function checkCampayTransaction(reference: string): Promise<CampayTransactionStatus> {
  const token = await getCampayToken();

  const res = await fetch(`${getBaseUrl()}transaction/${reference}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || errData.detail || `Transaction query error (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data;
}
