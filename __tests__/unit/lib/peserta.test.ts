import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock chain builder for Supabase query
function createMockQueryBuilder(resolvedValue: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'order', 'single'];

  methods.forEach((method) => {
    builder[method] = vi.fn(() => builder);
  });

  // The terminal methods resolve the value
  builder.single = vi.fn(() => Promise.resolve(resolvedValue));
  builder.order = vi.fn(() => Promise.resolve(resolvedValue));
  builder.eq = vi.fn(() => {
    // Return builder for chaining, but also make it thenable for delete
    const chainable = { ...builder, then: (resolve: (val: unknown) => void) => resolve(resolvedValue) };
    return chainable;
  });

  return builder;
}

// Create a more realistic mock
const mockFrom = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

describe('lib/peserta', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPesertaByNim', () => {
    it('should return peserta when NIM is found', async () => {
      const mockPeserta = {
        id: '123',
        nim: '12345678',
        nama: 'John Doe',
        status: 'wawancara',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: mockPeserta, error: null });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      const { getPesertaByNim } = await import('../../../lib/peserta');
      const result = await getPesertaByNim('12345678');

      expect(mockFrom).toHaveBeenCalledWith('peserta');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('nim', '12345678');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockPeserta);
    });

    it('should return null when NIM is not found (PGRST116)', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'No rows found' },
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      const { getPesertaByNim } = await import('../../../lib/peserta');
      const result = await getPesertaByNim('99999999');

      expect(result).toBeNull();
    });

    it('should throw error on other database errors', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'OTHER', message: 'Connection failed' },
      });
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ select: mockSelect });

      const { getPesertaByNim } = await import('../../../lib/peserta');

      await expect(getPesertaByNim('12345678')).rejects.toThrow(
        'Failed to get peserta by NIM: Connection failed'
      );
    });
  });

  describe('getAllPeserta', () => {
    it('should return all peserta ordered by created_at desc', async () => {
      const mockPesertaList = [
        { id: '1', nim: '11111111', nama: 'Alice', status: 'lulus', created_at: '2025-01-02', updated_at: '2025-01-02' },
        { id: '2', nim: '22222222', nama: 'Bob', status: 'wawancara', created_at: '2025-01-01', updated_at: '2025-01-01' },
      ];

      const mockOrder = vi.fn().mockResolvedValue({ data: mockPesertaList, error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const { getAllPeserta } = await import('../../../lib/peserta');
      const result = await getAllPeserta();

      expect(mockFrom).toHaveBeenCalledWith('peserta');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual(mockPesertaList);
    });

    it('should return empty array when no peserta exist', async () => {
      const mockOrder = vi.fn().mockResolvedValue({ data: [], error: null });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const { getAllPeserta } = await import('../../../lib/peserta');
      const result = await getAllPeserta();

      expect(result).toEqual([]);
    });

    it('should throw error on database failure', async () => {
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database unavailable' },
      });
      const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
      mockFrom.mockReturnValue({ select: mockSelect });

      const { getAllPeserta } = await import('../../../lib/peserta');

      await expect(getAllPeserta()).rejects.toThrow(
        'Failed to get all peserta: Database unavailable'
      );
    });
  });

  describe('createPeserta', () => {
    it('should create a new peserta and return it', async () => {
      const inputData = {
        nim: '12345678',
        nama: 'New Student',
        status: 'wawancara' as const,
        hari_wawancara: 'Senin',
        tanggal_wawancara: '2025-07-15',
        waktu_wawancara: '10:00',
        lokasi_wawancara: 'Ruang Rapat Lt.3',
      };

      const createdPeserta = {
        ...inputData,
        id: 'new-uuid',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: createdPeserta, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      mockFrom.mockReturnValue({ insert: mockInsert });

      const { createPeserta } = await import('../../../lib/peserta');
      const result = await createPeserta(inputData);

      expect(mockFrom).toHaveBeenCalledWith('peserta');
      expect(mockInsert).toHaveBeenCalledWith(inputData);
      expect(result).toEqual(createdPeserta);
    });

    it('should throw error on creation failure', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Duplicate NIM' },
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });
      mockFrom.mockReturnValue({ insert: mockInsert });

      const { createPeserta } = await import('../../../lib/peserta');

      await expect(
        createPeserta({ nim: '12345678', nama: 'Test', status: 'wawancara' })
      ).rejects.toThrow('Failed to create peserta: Duplicate NIM');
    });
  });

  describe('updatePeserta', () => {
    it('should update peserta and return updated record', async () => {
      const updatedPeserta = {
        id: '123',
        nim: '12345678',
        nama: 'Updated Name',
        status: 'lulus',
        bidang: 'Kominfo',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      };

      const mockSingle = vi.fn().mockResolvedValue({ data: updatedPeserta, error: null });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ update: mockUpdate });

      const { updatePeserta } = await import('../../../lib/peserta');
      const result = await updatePeserta('123', { nama: 'Updated Name', status: 'lulus', bidang: 'Kominfo' });

      expect(mockFrom).toHaveBeenCalledWith('peserta');
      expect(mockUpdate).toHaveBeenCalledWith({ nama: 'Updated Name', status: 'lulus', bidang: 'Kominfo' });
      expect(mockEq).toHaveBeenCalledWith('id', '123');
      expect(result).toEqual(updatedPeserta);
    });

    it('should throw error on update failure', async () => {
      const mockSingle = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Record not found' },
      });
      const mockSelect = vi.fn().mockReturnValue({ single: mockSingle });
      const mockEq = vi.fn().mockReturnValue({ select: mockSelect });
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ update: mockUpdate });

      const { updatePeserta } = await import('../../../lib/peserta');

      await expect(
        updatePeserta('nonexistent', { nama: 'Test' })
      ).rejects.toThrow('Failed to update peserta: Record not found');
    });
  });

  describe('deletePeserta', () => {
    it('should delete peserta successfully', async () => {
      const mockEq = vi.fn().mockResolvedValue({ data: null, error: null });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ delete: mockDelete });

      const { deletePeserta } = await import('../../../lib/peserta');
      await deletePeserta('123');

      expect(mockFrom).toHaveBeenCalledWith('peserta');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', '123');
    });

    it('should throw error on deletion failure', async () => {
      const mockEq = vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Foreign key constraint' },
      });
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq });
      mockFrom.mockReturnValue({ delete: mockDelete });

      const { deletePeserta } = await import('../../../lib/peserta');

      await expect(deletePeserta('123')).rejects.toThrow(
        'Failed to delete peserta: Foreign key constraint'
      );
    });
  });
});
