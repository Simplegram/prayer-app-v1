let currentCleanup = null;

function navigate(hash) {
  window.location.hash = hash;
}

async function render() {
  const hash = window.location.hash || '#/';

  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }

  const root = document.getElementById('app');
  root.innerHTML = '';

  if (hash === '#/' || hash === '') {
    const { render: renderLibrary } = await import('./views/library.js');
    currentCleanup = renderLibrary(root);
  } else if (hash.startsWith('#/folder/')) {
    const folderId = parseInt(hash.split('/')[2], 10);
    const { render: renderFolder } = await import('./views/folder.js');
    currentCleanup = renderFolder(root, folderId);
  } else if (hash.startsWith('#/subfolder/')) {
    const subfolderId = parseInt(hash.split('/')[2], 10);
    const { render: renderSubfolder } = await import('./views/subfolder.js');
    currentCleanup = renderSubfolder(root, subfolderId);
  } else if (hash.startsWith('#/read/folder/')) {
    const folderId = parseInt(hash.split('/')[3], 10);
    const { render: renderReader } = await import('./views/reader.js');
    currentCleanup = renderReader(root, folderId, 'folder');
  } else if (hash.startsWith('#/read/')) {
    const subfolderId = parseInt(hash.split('/')[2], 10);
    const { render: renderReader } = await import('./views/reader.js');
    currentCleanup = renderReader(root, subfolderId);
  } else if (hash === '#/admin') {
    const { render: renderAdmin } = await import('./views/admin.js');
    currentCleanup = renderAdmin(root);
  }

  window.scrollTo(0, 0);
}

export const app = {
  init() {
    window.addEventListener('hashchange', render);
    render();
  },
};

export function go(hash) {
  navigate(hash);
}
