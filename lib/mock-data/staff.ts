export type StaffMember = {
  id: string;
  name: string;
  pin: string;
  role: 'Administrator' | 'Manager' | 'Supervisor' | 'Till Staff';
  permissionOverride?: Partial<Record<string, boolean>>;
  discountLimit: number; // max % discount before manager approval needed
  showOnSignOn: boolean;
};

export const STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    name: 'Admin User',
    pin: '0000',
    role: 'Administrator',
    discountLimit: 100,
    showOnSignOn: false,
  },
  {
    id: 'staff-2',
    name: 'Sarah Clarke',
    pin: '1234',
    role: 'Manager',
    discountLimit: 50,
    showOnSignOn: true,
  },
  {
    id: 'staff-3',
    name: 'James Patel',
    pin: '2222',
    role: 'Supervisor',
    discountLimit: 20,
    showOnSignOn: true,
  },
  {
    id: 'staff-4',
    name: 'Amy Chen',
    pin: '3333',
    role: 'Till Staff',
    discountLimit: 10,
    showOnSignOn: true,
  },
  {
    id: 'staff-5',
    name: 'Tom Walsh',
    pin: '4444',
    role: 'Till Staff',
    discountLimit: 10,
    showOnSignOn: true,
    // Example of individual override: Tom can do refunds without manager approval
    permissionOverride: { canRefundWithoutApproval: true },
  },
];
