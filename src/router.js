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
    const { render: renderLibrary, cleanup } = await import('./views/library.js');
    renderLibrary(root);
    currentCleanup = cleanup;
  } else if (hash.startsWith('#/folder/')) {
    const folderId = parseInt(hash.split('/')[2], 10);
    const { render: renderFolder, cleanup } = await import('./views/folder.js');
    renderFolder(root, folderId);
    currentCleanup = cleanup;
  } else if (hash.startsWith('#/subfolder/')) {
    const subfolderId = parseInt(hash.split('/')[2], 10);
    const { render: renderSubfolder, cleanup } = await import('./views/subfolder.js');
    renderSubfolder(root, subfolderId);
    currentCleanup = cleanup;
  } else if (hash.startsWith('#/read/')) {
    const subfolderId = parseInt(hash.split('/')[2], 10);
    const { render: renderReader, cleanup } = await import('./views/reader.js');
    renderReader(root, subfolderId);
    currentCleanup = cleanup;
  } else if (hash === '#/admin') {
    const { render: renderAdmin, cleanup } = await import('./views/admin.js');
    renderAdmin(root);
    currentCleanup = cleanup;
  }

  window.scrollTo(0, 0);
}

export const app = {
  init() {
    window.addEventListener('hashchange', render);
    window.addEventListener('popstate', render);
    render();
  },
};

export function go(hash) {
  navigate(hash);
}
