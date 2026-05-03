import { db } from '../db.js';

export function render(root, folderId) {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-cream';

  const header = document.createElement('header');
  header.className = 'sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3';

  const backBtn = document.createElement('button');
  backBtn.className = 'flex items-center gap-3 px-6 py-4 text-xl font-bold bg-white border-b border-gray-200 min-h-[60px] w-full text-left';
  backBtn.innerHTML = '<span aria-hidden="true">&#8592;</span> Back';
  backBtn.addEventListener('click', () => { window.history.back(); });

  const h1 = document.createElement('h1');
  h1.id = 'folder-title';
  h1.className = 'text-center text-2xl font-bold px-4 py-3';
  h1.textContent = 'Loading...';

  header.appendChild(backBtn);
  header.appendChild(h1);
  container.appendChild(header);

  const main = document.createElement('main');
  main.className = 'max-w-2xl mx-auto px-4 py-6';
  container.appendChild(main);

  loadSubfolders();

  async function loadSubfolders() {
    try {
      const folder = await db.folders.get(folderId);

      if (!folder) {
        main.innerHTML = '<p class="text-center text-xl py-8">Folder not found.</p>';
        return;
      }

      document.getElementById('folder-title').textContent = folder.name;

      const subfolders = await db.subfolders.where('folderId').equals(folderId).toArray();

      if (subfolders.length === 0) {
        main.innerHTML = '<p class="text-center text-xl py-8 text-gray-500">No subfolders in this folder.</p>';
        return;
      }

      const grid = document.createElement('div');
      grid.className = 'grid gap-4';

      for (const subfolder of subfolders) {
        const count = await db.prayers.where('subfolderId').equals(subfolder.id).count();

        const card = document.createElement('a');
        card.href = `#/subfolder/${subfolder.id}`;
        card.className = 'block bg-white border-2 border-gray-200 rounded-xl px-6 py-5 min-h-[80px] flex items-center justify-between hover:border-blue-400 active:bg-blue-50';

        const left = document.createElement('div');
        const name = document.createElement('span');
        name.className = 'text-xl font-bold';
        name.textContent = subfolder.name;

        const countLabel = document.createElement('span');
        countLabel.className = 'block text-lg text-gray-500 mt-1';
        countLabel.textContent = `${count} prayer${count !== 1 ? 's' : ''}`;

        left.appendChild(name);
        left.appendChild(countLabel);

        const arrow = document.createElement('span');
        arrow.className = 'text-3xl text-gray-400';
        arrow.innerHTML = '&rarr;';

        card.appendChild(left);
        card.appendChild(arrow);
        grid.appendChild(card);
      }

      main.appendChild(grid);
    } catch (err) {
      main.innerHTML = '<p class="text-center text-xl py-8 text-red-600">Error loading folder.</p>';
    }
  }

  root.appendChild(container);

  return function cleanup() {};
}
