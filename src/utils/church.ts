// Where the church is, for the maps on the Home and Contact pages
export const CHURCH_ADDRESS = '140 Obafemi Awolowo Way, Radio Bus Stop, Molako, Ikorodu, Lagos, Nigeria';
export const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(CHURCH_ADDRESS)}&z=16&output=embed`;
export const DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CHURCH_ADDRESS)}`;

// Accounts that may open the admin area (the server uses the same list of leadership and media roles)
const STAFF_ROLES = ['super_admin', 'admin', 'head_admin', 'church_admin', 'media', 'media_head', 'gen_overseer', 'senior_pastor', 'pastor', 'church_committee_chairman'];
export const isStaff = (role?: string | null) => STAFF_ROLES.includes((role || '').toLowerCase().trim());
