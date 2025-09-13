// JWT decode utility (simple version without external library)
export interface TokenPayload {
  scope?: string;
  role?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    // JWT có 3 parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '=='.substring(0, (4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload) as TokenPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Role definitions
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  LEGAL_CASE_MANAGER = 'LEGAL_CASE_MANAGER',
  JUDGE = 'JUDGE',
  MEDIATOR = 'MEDIATOR'
}

// Permission definitions
export enum Permission {
  // Menu access
  VIEW_HOME = 'VIEW_HOME',
  VIEW_RANDOM_ASSIGNMENT = 'VIEW_RANDOM_ASSIGNMENT',
  VIEW_LEGAL_CASE = 'VIEW_LEGAL_CASE',
  VIEW_CASE_DATA_MANAGER = 'VIEW_CASE_DATA_MANAGER',
  VIEW_DECISION_TYPE = 'VIEW_DECISION_TYPE',
  VIEW_OFFICER_MANAGER = 'VIEW_OFFICER_MANAGER',
  VIEW_ACCOUNT_MANAGER = 'VIEW_ACCOUNT_MANAGER',
  VIEW_REPORTS = 'VIEW_REPORTS',
  
  // Legal case actions
  CREATE_LEGAL_CASE = 'CREATE_LEGAL_CASE',
  EDIT_LEGAL_CASE = 'EDIT_LEGAL_CASE',
  DELETE_LEGAL_CASE = 'DELETE_LEGAL_CASE',
  ASSIGN_LEGAL_CASE = 'ASSIGN_LEGAL_CASE',
  
  // Other actions
  MANAGE_OFFICERS = 'MANAGE_OFFICERS',
  MANAGE_ACCOUNTS = 'MANAGE_ACCOUNTS',
  MANAGE_DECISION_TYPES = 'MANAGE_DECISION_TYPES',
  MANAGE_CASE_DATA = 'MANAGE_CASE_DATA'
}

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Full access to everything
    Permission.VIEW_HOME,
    Permission.VIEW_RANDOM_ASSIGNMENT,
    Permission.VIEW_LEGAL_CASE,
    Permission.VIEW_CASE_DATA_MANAGER,
    Permission.VIEW_DECISION_TYPE,
    Permission.VIEW_OFFICER_MANAGER,
    Permission.VIEW_ACCOUNT_MANAGER,
    Permission.VIEW_REPORTS,
    Permission.CREATE_LEGAL_CASE,
    Permission.EDIT_LEGAL_CASE,
    Permission.DELETE_LEGAL_CASE,
    Permission.ASSIGN_LEGAL_CASE,
    Permission.MANAGE_OFFICERS,
    Permission.MANAGE_ACCOUNTS,
    Permission.MANAGE_DECISION_TYPES,
    Permission.MANAGE_CASE_DATA
  ],
  
  [UserRole.MANAGER]: [
    // Manager không được truy cập case-data-manager, officer-manager, decision-type, account-manager
    Permission.VIEW_HOME,
    Permission.VIEW_RANDOM_ASSIGNMENT,
    Permission.VIEW_LEGAL_CASE,
    Permission.VIEW_REPORTS,
    Permission.CREATE_LEGAL_CASE,
    Permission.EDIT_LEGAL_CASE,
    Permission.DELETE_LEGAL_CASE,
    Permission.ASSIGN_LEGAL_CASE
  ],
  
  [UserRole.LEGAL_CASE_MANAGER]: [
    // Legal case manager không được xóa án
    Permission.VIEW_HOME,
    Permission.VIEW_RANDOM_ASSIGNMENT,
    Permission.VIEW_LEGAL_CASE,
    Permission.VIEW_CASE_DATA_MANAGER,
    Permission.VIEW_DECISION_TYPE,
    Permission.VIEW_OFFICER_MANAGER,
    Permission.VIEW_ACCOUNT_MANAGER,
    Permission.VIEW_REPORTS,
    Permission.CREATE_LEGAL_CASE,
    Permission.EDIT_LEGAL_CASE,
    Permission.ASSIGN_LEGAL_CASE,
    Permission.MANAGE_OFFICERS,
    Permission.MANAGE_ACCOUNTS,
    Permission.MANAGE_DECISION_TYPES,
    Permission.MANAGE_CASE_DATA
  ],
  
  [UserRole.JUDGE]: [
    // Judge chỉ được xem legal-case, không được thêm/sửa/xóa
    Permission.VIEW_HOME,
    Permission.VIEW_LEGAL_CASE
  ],
  
  [UserRole.MEDIATOR]: [
    // Mediator chỉ được xem legal-case, không được thêm/sửa/xóa
    Permission.VIEW_HOME,
    Permission.VIEW_LEGAL_CASE
  ]
};

export const getUserRole = (token: string): UserRole | null => {
  const payload = decodeToken(token);
  if (!payload) return null;
  
  // Lấy role từ scope hoặc role field
  const roleString = payload.scope || payload.role;
  if (!roleString) return null;
  
  // Parse role từ string (có thể là "ROLE_ADMIN" hoặc "ADMIN")
  const normalizedRole = roleString.replace('ROLE_', '').toUpperCase();
  
  if (Object.values(UserRole).includes(normalizedRole as UserRole)) {
    return normalizedRole as UserRole;
  }
  
  return null;
};

export const hasPermission = (token: string, permission: Permission): boolean => {
  const role = getUserRole(token);
  if (!role) return false;
  
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
};

export const hasAnyPermission = (token: string, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(token, permission));
};

export const getUserPermissions = (token: string): Permission[] => {
  const role = getUserRole(token);
  if (!role) return [];
  
  return ROLE_PERMISSIONS[role];
};