export type Role = 'Main'|'Owner'|'Admin'|'Reseller';

export function canEditPrice(role: Role, panelSlug: string){
  return role === 'Main' || role === 'Owner' || panelSlug === 'main';
}

export function canUpload(feature: 'uploads:apk'|'uploads:obb', role: Role, features: Record<string, boolean>){
  if (role === 'Main') return true;
  if (role === 'Owner') return !!features?.[feature];
  return false; // Admin/Reseller never
}
