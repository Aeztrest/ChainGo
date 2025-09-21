'use client';

import { AppConfig, UserSession } from '@stacks/auth';
import { showConnect } from '@stacks/connect';

type StacksProvider = {
  request?: (args: { method: string }) => Promise<any>;
};

export interface StacksUser {
  addresses: {
    stx: Array<{ address: string }>;
    btc: Array<{ address: string }>;
  };
}

export interface StacksAccount {
  address: string;
  publicKey: string;
  gaiaHubUrl: string;
  gaiaAppKey: string;
}

export interface StacksAccountsResponse {
  addresses: StacksAccount[];
}

/* ----------------------- UserSession / AppConfig ----------------------- */
const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

/* ------------------------ Provider (Leather) --------------------------- */
function getProvider(): StacksProvider | null {
  if (typeof window === 'undefined') return null;
  return (window as any).LeatherProvider ?? (window as any).StacksProvider ?? null;
}

/* --------- Eski/bozuk session yakalanırsa otomatik temizle ------------ */
export function isSignedIn(): boolean {
  try {
    return Boolean(userSession.isUserSignedIn?.());
  } catch (e) {
    try { userSession.signUserOut?.(); } catch {}
    try {
      localStorage.removeItem('blockstack');
      localStorage.removeItem('stacks-session');
      localStorage.removeItem('stxSession');
      localStorage.removeItem('connectAuthResponse');
    } catch {}
    console.warn('⚠️ Corrupt Stacks session cleared:', e);
    return false;
  }
}

/* ----------------------- Bağlı değilse bağlat -------------------------- */
export async function ensureConnected() {
  if (typeof window === 'undefined') return;

  if (!getProvider()) {
    throw new Error('Stacks/Leather cüzdanı bulunamadı (extension?).');
  }
  if (isSignedIn()) return;

  await new Promise<void>((resolve, reject) => {
    showConnect({
      userSession,
      appDetails: { name: 'ChainGo', icon: `${location.origin}/logo.png` },
      onFinish: () => resolve(),
      onCancel: () => reject(new Error('user-cancelled')),
    });
  });
}

/* -------------------- Public: bağlantı kontrolü ----------------------- */
export const checkStacksConnection = (): boolean => {
  const connected = isSignedIn();
  console.log('🔍 Stacks wallet bağlantı durumu (UserSession):', connected);
  return connected;
};

/* -------------------- STX adresi normalize helper --------------------- */
function pickStxAddress(raw: any): string {
  // düz string
  if (typeof raw === 'string') return raw;

  // { address: 'ST...' }
  if (raw && typeof raw === 'object' && typeof raw.address === 'string') return raw.address;

  // { testnet: 'ST...', mainnet: 'SP...' }
  if (raw && typeof raw === 'object') {
    const net = (process.env.NEXT_PUBLIC_STACKS_NETWORK || 'testnet').toLowerCase();
    if (net === 'mainnet' && typeof raw.mainnet === 'string') return raw.mainnet;
    if (typeof raw.testnet === 'string') return raw.testnet; // default testnet
    for (const v of Object.values(raw)) {
      if (typeof v === 'string') return v;
    }
  }
  return '';
}

/* ---------- Adresleri Leather RPC + UserSession’dan bul --------------- */
async function fetchAddresses(): Promise<StacksUser | null> {
  const provider = getProvider();

  // 1) Yeni RPC: getAddresses
  if (provider?.request) {
    try {
      const r = await provider.request({ method: 'getAddresses' });
      const payload = r?.result ?? r?.addresses ?? r;
      const stxArr = (payload?.stx ?? []).map((a: any) => ({ address: pickStxAddress(a.address ?? a) }));
      const btcArr = (payload?.btc ?? []).map((a: any) => ({ address: (a.address ?? a) as string }));
      if (stxArr.length || btcArr.length) {
        return { addresses: { stx: stxArr, btc: btcArr } };
      }
      console.warn('ℹ️ getAddresses boş döndü, fallback deneniyor…');
    } catch (e) {
      console.warn('⚠️ getAddresses başarısız, fallback:', e);
    }
  }

  // 2) Legacy RPC: stx_getAddresses / btc_getAddresses
  if (provider?.request) {
    let stx: any[] = [];
    let btc: any[] = [];
    try {
      const r1 = await provider.request({ method: 'stx_getAddresses' });
      const a1 = Array.isArray(r1) ? r1 : (r1?.result ?? r1?.addresses ?? []);
      if (Array.isArray(a1)) stx = a1.map((a: any) => ({ address: pickStxAddress(a.address ?? a) }));
    } catch {}
    try {
      const r2 = await provider.request({ method: 'btc_getAddresses' });
      const a2 = Array.isArray(r2) ? r2 : (r2?.result ?? r2?.addresses ?? []);
      if (Array.isArray(a2)) btc = a2.map((a: any) => ({ address: (a.address ?? a) as string }));
    } catch {}
    if (stx.length || btc.length) return { addresses: { stx, btc } };
  }

  // 3) Son çare: UserSession’dan STX adresi türet
  try {
    const ud: any = userSession.loadUserData?.();
    const raw =
      ud?.profile?.stxAddress ??
      ud?.profile?.stx_address ??
      ud?.identityAddress ??
      '';

    const stx = pickStxAddress(raw);
    if (stx) {
      return { addresses: { stx: [{ address: stx }], btc: [] } };
    }
  } catch (e) {
    console.warn('⚠️ UserSession’dan adres türetilemedi:', e);
  }

  return null;
}

/* ---------------------- Wallet’a bağlan ve adres al -------------------- */
export const connectStacksWallet = async (): Promise<StacksUser | null> => {
  try {
    console.log('🔗 Stacks wallet bağlantısı başlatılıyor…');

    if (!isSignedIn()) {
      await ensureConnected();
    }

    const userData = await fetchAddresses();
    console.log('👤 Stacks kullanıcı verileri:', userData);
    return userData;
  } catch (error) {
    console.error('❌ Stacks wallet bağlantı hatası:', error);
    return null;
  }
};

/* ----------------------------- Sign out -------------------------------- */
export const disconnectStacksWallet = (): void => {
  console.log('🔌 Stacks wallet bağlantısı kesiliyor…');
  try { userSession.signUserOut?.(); } catch {}
  try {
    localStorage.removeItem('stacks_address');
    localStorage.removeItem('stacks_user_data');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('wallet_address');
  } catch {}
  console.log('✅ Bağlantı ve cache temizlendi');
};

/* ------------------ Backend formatına adres hazırlama ------------------ */
export const formatStacksAddressForBackend = (userData: StacksUser): string => {
  const raw = userData?.addresses?.stx?.[0]?.address;
  const stxAddress = pickStxAddress(raw);
  console.log('🔄 STX adresi (backend’e gidecek):', stxAddress);
  return stxAddress;
};

/* ------------------------ Backend kullanıcı kontrol ------------------- */
export const checkUserExistsWithStacks = async (stacksUser: StacksUser): Promise<any> => {
  try {
    const walletAddress = formatStacksAddressForBackend(stacksUser);
    if (!walletAddress) {
      console.error('❌ Geçerli STX adresi bulunamadı');
      return null;
    }

    const response = await fetch('https://hackback.hackstack.com.tr/is_exists_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet_address: walletAddress }),
    });

    if (!response.ok) {
      console.error('❌ Backend API hatası:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Backend API bağlantı hatası:', error);
    return null;
  }
};

/* --------------------- Kullanıcı verilerini kaydet --------------------- */
export const saveStacksUserData = (stacksUser: StacksUser, backendResult: any): void => {
  try {
    const stxAddress = formatStacksAddressForBackend(stacksUser);
    if (stxAddress) {
      localStorage.setItem('stacks_address', stxAddress);
      localStorage.setItem('wallet_address', stxAddress); // backward compat
    }
    localStorage.setItem('stacks_user_data', JSON.stringify(stacksUser));

    if (backendResult?.token) {
      localStorage.setItem('jwt_token', backendResult.token);
    }

    if (backendResult?.user) {
      const userWithWallet = {
        ...backendResult.user,
        wallet_address: stxAddress,
        stx_address: stxAddress,
      };
      localStorage.setItem('user_info', JSON.stringify(userWithWallet));
    }
    console.log('✅ Stacks + backend verileri kaydedildi');
  } catch (error) {
    console.error('❌ Kullanıcı verileri kaydedilirken hata:', error);
  }
};

/* --------------------- Tüm oturum/cache temizliği ---------------------- */
export const clearStacksSession = (): void => {
  console.log('🧹 Tüm Stacks oturumu temizleniyor…');
  disconnectStacksWallet();
};
