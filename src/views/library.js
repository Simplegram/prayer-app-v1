import { db } from '../db.js';

function createNavHeader(title, showBack = false) {
  const header = document.createElement('header');
  header.className = 'sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3';

  const navRow = document.createElement('div');
  navRow.className = 'flex items-center justify-between';

  if (showBack) {
    const backBtn = document.createElement('button');
    backBtn.className = 'flex items-center gap-2 px-4 py-3 text-xl font-bold bg-white border-2 border-gray-300 rounded-lg min-h-[60px]';
    backBtn.innerHTML = '<span aria-hidden="true">&#8592;</span> Back';
    backBtn.addEventListener('click', () => { window.history.back(); });
    navRow.appendChild(backBtn);

    const spacer = document.createElement('div');
    spacer.className = 'flex-1';
    navRow.appendChild(spacer);

    const dummy = document.createElement('div');
    dummy.className = 'w-[60px]';
    navRow.appendChild(dummy);
  } else {
    const titleBar = document.createElement('div');
    titleBar.className = 'flex items-center justify-between w-full';

    const h1 = document.createElement('h1');
    h1.className = 'text-2xl font-bold';
    h1.textContent = title;

    const adminLink = document.createElement('a');
    adminLink.href = '#/admin';
    adminLink.className = 'px-4 py-3 text-lg font-semibold bg-gray-100 border-2 border-gray-300 rounded-lg min-h-[60px] min-w-[60px] flex items-center justify-center';
    adminLink.textContent = 'Admin';

    titleBar.appendChild(h1);
    titleBar.appendChild(adminLink);
    navRow.appendChild(titleBar);
  }

  header.appendChild(navRow);
  return header;
}

export function render(root) {
  const container = document.createElement('div');
  container.className = 'min-h-screen bg-cream';

  const header = createNavHeader('My Prayer Book', false);
  container.appendChild(header);

  const main = document.createElement('main');
  main.className = 'max-w-2xl mx-auto px-4 py-6';
  container.appendChild(main);

  loadFolders();

  async function loadFolders() {
    const folders = await db.folders.toArray();

    if (folders.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'text-center py-16 space-y-4';

      const msg = document.createElement('p');
      msg.className = 'text-2xl font-bold text-gray-500';
      msg.textContent = 'No prayers yet.';

      const submsg = document.createElement('p');
      submsg.className = 'text-xl text-gray-400';
      submsg.textContent = 'Go to Admin to add or import prayers.';

      empty.appendChild(msg);
      empty.appendChild(submsg);
      main.appendChild(empty);
      return;
    }

    const grid = document.createElement('div');
    grid.className = 'grid gap-4';

    for (const folder of folders) {
      const count = await db.prayers.where('folderId').equals(folder.id).count();

      const card = document.createElement('a');
      card.href = `#/folder/${folder.id}`;
      card.className = 'block bg-white border-2 border-gray-200 rounded-xl px-6 py-5 min-h-[80px] flex items-center justify-between hover:border-blue-400 active:bg-blue-50';

      const left = document.createElement('div');
      const name = document.createElement('span');
      name.className = 'text-xl font-bold';
      name.textContent = folder.name;

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
  }

  root.appendChild(container);

  return function cleanup() {};
}
