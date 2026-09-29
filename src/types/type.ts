export interface EventType {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  name: string;
  description: string;
  location: string;
  image: string;
  imageId: string;
  userid: number;
  user: UserType;
  datetime: string;
  listBooking: null;
  private: boolean;
  file: string;
  fileId: string;
  tagId: number | null;
  tag: TagType | null;
  type: string | null;
  count: number | null;
  price: number | null;
  phone: number | null;
}

export interface BookingType {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  bookingCode: string;
  phone: string;
  userId: number;
  user: UserType;
  eventId: number;
  event: EventType;
}

export interface UserType {
  ID: number;
  id: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  Events: EventType;
  image: string;
  platform: string;
  salary: number;
  department: string;
  status: string;
  bio: string;

  divisiId: number | null;
  divisi: DivisiType | null;
}

export interface DivisiType {
  ID: number;
  id: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null | string;

  divisi: string;
}

export interface EventFormData {
  name?: string;
  description?: string;
  image?: string;
  location?: string;
  datetime?: string;
  private?: boolean;
  file?: string;
  tagId: number | null;
  type: string | null;
  count: number | null;
  price: number | null;
}

export interface TagType {
  ID: number;

  CreatedAt: string;

  UpdatedAt: string;

  DeletedAt: null | string;

  name: string;

  divisi: string;
}
