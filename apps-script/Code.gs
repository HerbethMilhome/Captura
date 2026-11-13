/**
 * Capture o amor — Nathalie & Igor
 * Recebe as fotos enviadas pela página e salva numa pasta do Google Drive,
 * registrando nome e mensagem numa planilha dentro da mesma pasta.
 *
 * 1) Rode a função `setup` uma vez (menu ▶ Executar) e autorize.
 * 2) Implantar > Nova implantação > App da Web
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 3) Copie a URL (termina em /exec) para SCRIPT_URL no index.html.
 */

const FOLDER_NAME = 'Capture o amor — Nathalie & Igor';
const TIMEZONE = 'America/Sao_Paulo';
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB por foto
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/gif'];

/** Cria a pasta e a planilha de mensagens. Rode uma única vez. */
function setup() {
  const props = PropertiesService.getScriptProperties();
  let folderId = props.getProperty('FOLDER_ID');
  if (!folderId) {
    const folder = DriveApp.createFolder(FOLDER_NAME);
    folderId = folder.getId();
    props.setProperty('FOLDER_ID', folderId);
  }
  let sheetId = props.getProperty('SHEET_ID');
  if (!sheetId) {
    const ss = SpreadsheetApp.create('Mensagens — Nathalie & Igor');
    ss.getSheets()[0].appendRow(['Data/hora', 'Nome', 'Mensagem', 'Arquivo', 'Link', 'Envio']);
    ss.getSheets()[0].setFrozenRows(1);
    DriveApp.getFileById(ss.getId()).moveTo(DriveApp.getFolderById(folderId));
    sheetId = ss.getId();
    props.setProperty('SHEET_ID', sheetId);
  }
  Logger.log('Pasta: https://drive.google.com/drive/folders/' + folderId);
}

/** Abrir a URL no navegador só mostra que está funcionando. */
function doGet() {
  return json_({ ok: true, msg: 'Capture o amor está no ar 💚' });
}

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    const props = PropertiesService.getScriptProperties();
    const folderId = props.getProperty('FOLDER_ID');
    if (!folderId) throw new Error('Rode a função setup primeiro');

    const mime = String(p.mimeType || '').toLowerCase();
    if (ALLOWED.indexOf(mime) === -1) throw new Error('Tipo de arquivo não permitido');

    const bytes = Utilities.base64Decode(String(p.data || ''));
    if (!bytes.length) throw new Error('Arquivo vazio');
    if (bytes.length > MAX_BYTES) throw new Error('Arquivo grande demais');

    const name = clean_(p.name, 80);
    const message = clean_(p.message, 1000);
    const now = new Date();
    const stamp = Utilities.formatDate(now, TIMEZONE, 'yyyy-MM-dd_HH-mm-ss');
    const who = (name || 'convidado').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'convidado';
    const ext = String(p.ext || 'jpg').replace(/[^a-z0-9]/gi, '').slice(0, 5) || 'jpg';
    const fileName = stamp + '_' + who + '_' + (Number(p.index) || 1) + '.' + ext;

    const file = DriveApp.getFolderById(folderId)
      .createFile(Utilities.newBlob(bytes, mime, fileName));
    file.setDescription([name && 'De: ' + name, message].filter(String).join('\n'));

    const sheetId = props.getProperty('SHEET_ID');
    if (sheetId) {
      SpreadsheetApp.openById(sheetId).getSheets()[0].appendRow([
        Utilities.formatDate(now, TIMEZONE, 'dd/MM/yyyy HH:mm:ss'),
        name, message, fileName, file.getUrl(), clean_(p.batch, 20),
      ]);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function clean_(v, max) {
  // Remove "=" etc. no início para evitar fórmulas na planilha
  return String(v || '').trim().slice(0, max).replace(/^[=+\-@]+/, '');
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
