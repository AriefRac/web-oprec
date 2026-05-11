export interface SyncLog {
  id: string;
  timestamp: string;
  status: 'success' | 'error';
  records_synced: number;
  error_message?: string;
}
