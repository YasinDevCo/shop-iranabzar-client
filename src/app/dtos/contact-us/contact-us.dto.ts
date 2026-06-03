export interface MessageDto {
  _id: string;
  title: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  description: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: string;
  updatedAt: string;
}

export interface MessageRequestDto {
  title: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  description: string;
}

export interface MessageUpdateStatusDto {
  status: 'pending' | 'read' | 'replied';
}

export interface MessagesPaginatedResponse {
  contacts: MessageDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface MessageStatsDto {
  stats: {
    total: number;
    pending: number;
    read: number;
    replied: number;
  };
  latest: Array<{
    id: string;
    title: string;
    name: string;
    email: string;
    status: string;
    createdAt: string;
  }>;
}
