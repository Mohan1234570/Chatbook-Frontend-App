import { CreatedAtObject } from '../types';

export const normalizeCreatedAt = (createdAt: string | CreatedAtObject | undefined): string => {
  if (!createdAt) return 'Unknown date';
  return typeof createdAt === 'string'
    ? createdAt
    : createdAt.dateCreated || 'Unknown date';
};
