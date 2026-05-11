/**
 * Google Apps Script - Sinkronisasi Google Sheets ke Supabase
 * 
 * Script ini berjalan di Google Apps Script environment dan berfungsi untuk:
 * 1. Auto-sync data pendaftaran dari Google Forms/Sheets ke Supabase
 * 2. Manual sync seluruh data (bulk sync)
 * 3. Logging hasil sinkronisasi ke tabel sync_log
 * 
 * Setup:
 * 1. Buka Google Sheets yang terhubung dengan Google Forms
 * 2. Extensions > Apps Script
 * 3. Paste kode ini ke Code.gs
 * 4. Tambahkan Script Properties:
 *    - SUPABASE_URL: URL project Supabase (e.g., https://xxx.supabase.co)
 *    - SUPABASE_ANON_KEY: Anon/public key Supabase
 *    - SUPABASE_SERVICE_KEY: Service role key Supabase
 * 5. Setup trigger: Edit > Triggers > Add Trigger > onFormSubmit > From spreadsheet > On form submit
 */

// ============================================================
// CONFIGURATION
// ============================================================

/**
 * Mengambil konfigurasi dari Script Properties
 * @returns {Object} Konfigurasi Supabase
 */
function getConfig() {
  var props = PropertiesService.getScriptProperties();
  return {
    supabaseUrl: props.getProperty('SUPABASE_URL'),
    supabaseAnonKey: props.getProperty('SUPABASE_ANON_KEY'),
    supabaseServiceKey: props.getProperty('SUPABASE_SERVICE_KEY')
  };
}

/**
 * Validasi konfigurasi Script Properties
 * @returns {boolean} true jika konfigurasi valid
 */
function validateConfig() {
  var config = getConfig();
  if (!config.supabaseUrl || !config.supabaseAnonKey || !config.supabaseServiceKey) {
    Logger.log('ERROR: Script Properties belum dikonfigurasi. Pastikan SUPABASE_URL, SUPABASE_ANON_KEY, dan SUPABASE_SERVICE_KEY sudah diisi.');
    return false;
  }
  return true;
}

// ============================================================
// COLUMN MAPPING
// ============================================================

/**
 * Mapping kolom Google Sheets ke field peserta
 * Column A (index 0): Timestamp (dari Google Forms)
 * Column B (index 1): NIM
 * Column C (index 2): Nama
 */
var COLUMN_NIM = 1;   // Column B (0-indexed)
var COLUMN_NAMA = 2;  // Column C (0-indexed)

// ============================================================
// TRIGGER FUNCTIONS
// ============================================================

/**
 * Trigger otomatis saat Google Form di-submit
 * Dipanggil oleh Google Sheets trigger "On form submit"
 * 
 * @param {Object} e - Event object dari trigger
 */
function onFormSubmit(e) {
  if (!validateConfig()) {
    logSyncResult('error', 0, 'Script Properties belum dikonfigurasi');
    return;
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    var data = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0];

    var nim = String(data[COLUMN_NIM]).trim();
    var nama = String(data[COLUMN_NAMA]).trim();

    // Validasi data
    if (!nim || !nama) {
      Logger.log('WARNING: Data tidak lengkap pada row ' + lastRow + '. NIM: "' + nim + '", Nama: "' + nama + '"');
      logSyncResult('error', 0, 'Data tidak lengkap pada row ' + lastRow + ': NIM atau Nama kosong');
      return;
    }

    // Buat payload peserta
    var peserta = {
      nim: nim,
      nama: nama,
      status: 'wawancara'  // Default status saat baru mendaftar
    };

    // Upsert ke Supabase
    var result = upsertPeserta(peserta);

    if (result.success) {
      Logger.log('SUCCESS: Peserta ' + nim + ' (' + nama + ') berhasil disinkronisasi');
      logSyncResult('success', 1, null);
    } else {
      Logger.log('ERROR: Gagal sync peserta ' + nim + '. Error: ' + result.error);
      logSyncResult('error', 0, 'Gagal sync NIM ' + nim + ': ' + result.error);
    }

  } catch (error) {
    Logger.log('ERROR: Exception pada onFormSubmit - ' + error.message);
    logSyncResult('error', 0, 'Exception: ' + error.message);
  }
}

// ============================================================
// MANUAL SYNC FUNCTIONS
// ============================================================

/**
 * Sinkronisasi manual seluruh data dari Google Sheets ke Supabase
 * Berguna untuk initial sync atau re-sync setelah error
 * Jalankan manual dari Apps Script editor: Run > syncAllRows
 */
function syncAllRows() {
  if (!validateConfig()) {
    logSyncResult('error', 0, 'Script Properties belum dikonfigurasi');
    return;
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();

  // Skip header row (row 1)
  if (lastRow < 2) {
    Logger.log('INFO: Tidak ada data untuk disinkronisasi');
    logSyncResult('success', 0, null);
    return;
  }

  var dataRange = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn());
  var allData = dataRange.getValues();

  var successCount = 0;
  var errorCount = 0;
  var errors = [];

  for (var i = 0; i < allData.length; i++) {
    var row = allData[i];
    var nim = String(row[COLUMN_NIM]).trim();
    var nama = String(row[COLUMN_NAMA]).trim();
    var rowNumber = i + 2; // +2 karena skip header dan 0-indexed

    // Skip row kosong
    if (!nim || !nama) {
      Logger.log('SKIP: Row ' + rowNumber + ' - data tidak lengkap');
      continue;
    }

    var peserta = {
      nim: nim,
      nama: nama,
      status: 'wawancara'
    };

    var result = upsertPeserta(peserta);

    if (result.success) {
      successCount++;
    } else {
      errorCount++;
      errors.push('Row ' + rowNumber + ' (NIM: ' + nim + '): ' + result.error);
    }

    // Rate limiting: jeda 100ms antar request untuk menghindari rate limit
    Utilities.sleep(100);
  }

  // Log hasil keseluruhan
  var totalProcessed = successCount + errorCount;
  Logger.log('SYNC COMPLETE: ' + successCount + ' berhasil, ' + errorCount + ' gagal dari ' + totalProcessed + ' total');

  if (errorCount > 0) {
    var errorMessage = errorCount + ' row gagal sync: ' + errors.join('; ');
    logSyncResult('error', successCount, errorMessage);
  } else {
    logSyncResult('success', successCount, null);
  }
}

// ============================================================
// SUPABASE API FUNCTIONS
// ============================================================

/**
 * Upsert data peserta ke Supabase (insert atau update berdasarkan NIM)
 * Menggunakan header Prefer: resolution=merge-duplicates untuk menghindari duplikasi
 * 
 * @param {Object} peserta - Object peserta {nim, nama, status}
 * @returns {Object} {success: boolean, error?: string}
 */
function upsertPeserta(peserta) {
  var config = getConfig();
  var url = config.supabaseUrl + '/rest/v1/peserta';

  try {
    var options = {
      method: 'POST',
      headers: {
        'apikey': config.supabaseAnonKey,
        'Authorization': 'Bearer ' + config.supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      payload: JSON.stringify(peserta),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();

    if (responseCode === 200 || responseCode === 201) {
      return { success: true };
    } else {
      var responseBody = response.getContentText();
      return { success: false, error: 'HTTP ' + responseCode + ': ' + responseBody };
    }

  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Log hasil sinkronisasi ke tabel sync_log di Supabase
 * 
 * @param {string} status - 'success' atau 'error'
 * @param {number} recordsSynced - Jumlah record yang berhasil disinkronisasi
 * @param {string|null} errorMessage - Pesan error (null jika sukses)
 */
function logSyncResult(status, recordsSynced, errorMessage) {
  var config = getConfig();

  // Jika config belum valid, hanya log ke Logger
  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    Logger.log('SYNC LOG (local only): status=' + status + ', records=' + recordsSynced + ', error=' + errorMessage);
    return;
  }

  var url = config.supabaseUrl + '/rest/v1/sync_log';

  var logEntry = {
    status: status,
    records_synced: recordsSynced
  };

  if (errorMessage) {
    logEntry.error_message = errorMessage;
  }

  try {
    var options = {
      method: 'POST',
      headers: {
        'apikey': config.supabaseAnonKey,
        'Authorization': 'Bearer ' + config.supabaseServiceKey,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(logEntry),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();

    if (responseCode !== 200 && responseCode !== 201) {
      Logger.log('WARNING: Gagal menulis sync_log. HTTP ' + responseCode + ': ' + response.getContentText());
    }

  } catch (error) {
    Logger.log('WARNING: Exception saat menulis sync_log - ' + error.message);
  }
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Test koneksi ke Supabase
 * Jalankan manual untuk memverifikasi konfigurasi sudah benar
 */
function testConnection() {
  if (!validateConfig()) {
    Logger.log('FAILED: Konfigurasi tidak valid');
    return;
  }

  var config = getConfig();
  var url = config.supabaseUrl + '/rest/v1/peserta?select=count&limit=0';

  try {
    var options = {
      method: 'GET',
      headers: {
        'apikey': config.supabaseAnonKey,
        'Authorization': 'Bearer ' + config.supabaseServiceKey
      },
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var responseCode = response.getResponseCode();

    if (responseCode === 200) {
      Logger.log('SUCCESS: Koneksi ke Supabase berhasil!');
    } else {
      Logger.log('FAILED: HTTP ' + responseCode + ' - ' + response.getContentText());
    }

  } catch (error) {
    Logger.log('FAILED: ' + error.message);
  }
}

/**
 * Menampilkan konfigurasi saat ini (tanpa menampilkan key secara penuh)
 * Berguna untuk debugging
 */
function showConfig() {
  var config = getConfig();
  Logger.log('SUPABASE_URL: ' + (config.supabaseUrl ? config.supabaseUrl : '(not set)'));
  Logger.log('SUPABASE_ANON_KEY: ' + (config.supabaseAnonKey ? '***' + config.supabaseAnonKey.slice(-8) : '(not set)'));
  Logger.log('SUPABASE_SERVICE_KEY: ' + (config.supabaseServiceKey ? '***' + config.supabaseServiceKey.slice(-8) : '(not set)'));
}
