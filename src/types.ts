export type User = {
  userId: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
};

// Add this type so other files can import CreatedAtObject
export type CreatedAtObject = {
  createdAt?: string | Date;
  dateCreated?: string | Date;
};