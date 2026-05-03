import { db, addPrayer, exportPrayers, importPrayers } from '../db.js';

function createBackButton() {
  const btn = document.createElement('button');
  btn.className = 'flex items-center gap-3 px-6 py-4 text-xl font-bold bg-white border-b border-gray-200 min-h-[60px]';
  btn.innerHTML = '<span aria-hidden="true">&#8592;</span> Back';
  return btn;
}

function createHeader(title) {
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4';

  const backButton = createBackButton();
  backButton.addEventListener('click', () => { window.history.back(); });

  const h1 = document.createElement('h1');
  h1.className = 'text-center text-2xl font-bold px-4 py-3';
  h1.textContent = title;

  header.appendChild(backButton);
  header.appendChild(h1);
  return header;
}

export function render(root) {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-cream';

  const header = createHeader('Admin Dashboard');
  container.appendChild(header);

  const content = document.createElement('main');
  content.className = 'max-w-2xl mx-auto px-4 py-6 space-y-8';

  // Add Prayer Form
  const formSection = document.createElement('section');
  formSection.className = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5';

  const formTitle = document.createElement('h2');
  formTitle.className = 'text-2xl font-bold';
  formTitle.textContent = 'Add Prayer';
  formSection.appendChild(formTitle);

  const form = document.createElement('form');
  form.className = 'space-y-5';

  // Title field (text input)
  const titleGroup = document.createElement('div');
  const titleLabel = document.createElement('label');
  titleLabel.htmlFor = 'title';
  titleLabel.className = 'block text-lg font-semibold mb-2';
  titleLabel.textContent = 'Prayer Title';

  const titleInput = document.createElement('input');
  titleInput.id = 'title';
  titleInput.name = 'title';
  titleInput.type = 'text';
  titleInput.required = true;
  titleInput.className = 'w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[60px]';

  titleGroup.appendChild(titleLabel);
  titleGroup.appendChild(titleInput);
  form.appendChild(titleGroup);

  // Folder field (input with datalist for existing folders)
  const folderGroup = document.createElement('div');
  const folderLabel = document.createElement('label');
  folderLabel.htmlFor = 'folderName';
  folderLabel.className = 'block text-lg font-semibold mb-2';
  folderLabel.textContent = 'Folder Name';

  const folderInput = document.createElement('input');
  folderInput.id = 'folderName';
  folderInput.name = 'folderName';
  folderInput.type = 'text';
  folderInput.required = true;
  folderInput.setAttribute('list', 'folder-options');
  folderInput.className = 'w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[60px]';

  const folderDatalist = document.createElement('datalist');
  folderDatalist.id = 'folder-options';

  folderGroup.appendChild(folderLabel);
  folderGroup.appendChild(folderInput);
  folderGroup.appendChild(folderDatalist);
  form.appendChild(folderGroup);

  // Subfolder field (input with datalist, optional)
  const subfolderGroup = document.createElement('div');
  const subfolderLabel = document.createElement('label');
  subfolderLabel.htmlFor = 'subfolderName';
  subfolderLabel.className = 'block text-lg font-semibold mb-2';
  subfolderLabel.textContent = 'Subfolder Name (optional)';

  const subfolderInput = document.createElement('input');
  subfolderInput.id = 'subfolderName';
  subfolderInput.name = 'subfolderName';
  subfolderInput.type = 'text';
  subfolderInput.required = false;
  subfolderInput.setAttribute('list', 'subfolder-options');
  subfolderInput.className = 'w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[60px]';

  const subfolderDatalist = document.createElement('datalist');
  subfolderDatalist.id = 'subfolder-options';

  subfolderGroup.appendChild(subfolderLabel);
  subfolderGroup.appendChild(subfolderInput);
  subfolderGroup.appendChild(subfolderDatalist);
  form.appendChild(subfolderGroup);

  // Load existing folders into datalist on mount and when folder input gets focus
  async function loadFolderOptions() {
    const folders = await db.folders.orderBy('name').toArray();
    console.log(folders)
    folderDatalist.innerHTML = '';
    for (const f of folders) {
      const opt = document.createElement('option');
      opt.value = f.name;
      folderDatalist.appendChild(opt);
    }
  }

  async function loadSubfolderOptions(folderName) {
    console.log(folderName)
    subfolderDatalist.innerHTML = '';

    if (!folderName || !folderName.trim()) return;

    const folder = await db.folders.where('name').equals(folderName.trim()).first();
    if (!folder) return;

    const subfolders = await db.subfolders.where('folderId').equals(folder.id).orderBy('name').toArray();
    console.log(subfolders)
    for (const s of subfolders) {
      const opt = document.createElement('option');
      opt.value = s.name;
      subfolderDatalist.appendChild(opt);
    }
  }

  folderInput.addEventListener('input', () => loadSubfolderOptions(folderInput.value));

  // Reload folder options on form focus to catch newly added folders
  folderInput.addEventListener('focus', loadFolderOptions);

  const contentGroup = document.createElement('div');
  const contentLabel = document.createElement('label');
  contentLabel.htmlFor = 'content';
  contentLabel.className = 'block text-lg font-semibold mb-2';
  contentLabel.textContent = 'Prayer Content';

  const textarea = document.createElement('textarea');
  textarea.id = 'content';
  textarea.name = 'content';
  textarea.required = true;
  textarea.rows = 8;
  textarea.className = 'w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-200 min-h-[60px]';

  contentGroup.appendChild(contentLabel);
  contentGroup.appendChild(textarea);
  form.appendChild(contentGroup);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'w-full bg-blue-600 text-white text-xl font-bold py-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 min-h-[64px]';
  submitBtn.textContent = 'Save Prayer';

  form.appendChild(submitBtn);
  formSection.appendChild(form);
  content.appendChild(formSection);

  // JSON Import/Export Section
  const jsonSection = document.createElement('section');
  jsonSection.className = 'bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5';

  const jsonTitle = document.createElement('h2');
  jsonTitle.className = 'text-2xl font-bold';
  jsonTitle.textContent = 'JSON Import / Export';
  jsonSection.appendChild(jsonTitle);

  // Export button
  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'w-full bg-green-600 text-white text-xl font-bold py-4 rounded-lg hover:bg-green-700 active:bg-green-800 min-h-[64px]';
  exportBtn.textContent = 'Export All Prayers (JSON)';

  exportBtn.addEventListener('click', async () => {
    try {
      const data = await exportPrayers();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prayers-backup.json';
      a.click();
      URL.revokeObjectURL(url);

      exportBtn.textContent = 'Downloaded!';
      setTimeout(() => { exportBtn.textContent = 'Export All Prayers (JSON)'; }, 2000);
    } catch (err) {
      exportBtn.textContent = 'Error exporting';
      setTimeout(() => { exportBtn.textContent = 'Export All Prayers (JSON)'; }, 2000);
    }
  });

  jsonSection.appendChild(exportBtn);

  // Import file input + button
  const importLabel = document.createElement('label');
  importLabel.className = 'block text-lg font-semibold mb-2';
  importLabel.textContent = 'Import Prayers (JSON File)';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.className = 'w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg min-h-[60px]';

  const importBtn = document.createElement('button');
  importBtn.type = 'button';
  importBtn.className = 'w-full bg-purple-600 text-white text-xl font-bold py-4 rounded-lg hover:bg-purple-700 active:bg-purple-800 min-h-[64px] mt-3';
  importBtn.textContent = 'Import Prayers';

  importBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) {
      importBtn.textContent = 'Please select a file';
      setTimeout(() => { importBtn.textContent = 'Import Prayers'; }, 2000);
      return;
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!Array.isArray(data)) throw new Error('Invalid format');

      await importPrayers(data);

      importBtn.textContent = 'Imported Successfully!';
      importBtn.classList.remove('bg-purple-600');
      importBtn.classList.add('bg-green-600');
      setTimeout(() => {
        importBtn.textContent = 'Import Prayers';
        importBtn.classList.remove('bg-green-600');
        importBtn.classList.add('bg-purple-600');
      }, 3000);
    } catch (err) {
      importBtn.textContent = 'Error: Invalid JSON';
      setTimeout(() => { importBtn.textContent = 'Import Prayers'; }, 3000);
    }
  });

  jsonSection.appendChild(importLabel);
  jsonSection.appendChild(fileInput);
  jsonSection.appendChild(importBtn);

  content.appendChild(jsonSection);

  // Status message area
  const status = document.createElement('div');
  status.id = 'admin-status';
  status.className = 'text-center text-lg py-4';

  content.appendChild(status);
  container.appendChild(content);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const prayerData = {
      title: formData.get('title'),
      folderName: formData.get('folderName'),
      subfolderName: formData.get('subfolderName'),
      content: formData.get('content'),
    };

    submitBtn.textContent = 'Saving...';
    submitBtn.disabled = true;

    try {
      await addPrayer(prayerData);
      status.textContent = 'Prayer saved successfully!';
      status.className = 'text-center text-lg py-4 text-green-600 font-bold';
      titleInput.value = '';
      folderInput.value = '';
      subfolderInput.value = '';
      textarea.value = '';

      setTimeout(() => {
        status.textContent = '';
      }, 3000);
    } catch (err) {
      status.textContent = 'Error saving prayer';
      status.className = 'text-center text-lg py-4 text-red-600 font-bold';
    } finally {
      submitBtn.textContent = 'Save Prayer';
      submitBtn.disabled = false;
    }
  });

  root.appendChild(container);

  // Load folder options after DOM is mounted so datalist is in the document
  loadFolderOptions();

  return function cleanup() {};
}
