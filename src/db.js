import Dexie from 'dexie';

export const db = new Dexie('PrayerBookDB');

db.version(1).stores({
  folders: '++id, name',
  subfolders: '++id, name, folderId',
  prayers: '++id, title, subfolderId, folderId',
});

export async function importPrayers(data) {
  const tx = db.transaction('rw', db.folders, db.subfolders, db.prayers);

  for (const item of data) {
    let folder;
    folder = await tx.db.folders.where('name').equals(item.folder).first();
    if (!folder) {
      folder = { id: await tx.db.folders.add({ name: item.folder }) };
    }

    let subfolder;
    subfolder = await tx.db.subfolders
      .where({ name: item.subfolder, folderId: folder.id })
      .first();
    if (!subfolder) {
      subfolder = {
        id: await tx.db.subfolders.add({
          name: item.subfolder,
          folderId: folder.id,
        }),
      };
    }

    await tx.db.prayers.add({
      title: item.title,
      content: item.content,
      subfolderId: subfolder.id,
      folderId: folder.id,
    });
  }

  return tx.complete;
}

export async function exportPrayers() {
  const prayers = await db.prayers.toArray();
  const folders = await db.folders.toArray();
  const subfolders = await db.subfolders.toArray();

  return prayers.map((prayer) => {
    const folder = folders.find((f) => f.id === prayer.folderId);
    const subfolder = subfolders.find((s) => s.id === prayer.subfolderId);

    return {
      id: prayer.id,
      title: prayer.title,
      folder: folder?.name || 'Unknown',
      subfolder: subfolder?.name || 'Unknown',
      content: prayer.content,
    };
  });
}

export async function addPrayer({ title, folderName, subfolderName, content }) {
  let folder = await db.folders.where('name').equals(folderName).first();

  if (!folder) {
    const newFolderId = await db.folders.add({ name: folderName });
    folder = { id: newFolderId, name: folderName };
  }

  let subfolder = await db.subfolders
    .where({ name: subfolderName, folderId: folder.id })
    .first();

  if (!subfolder) {
    const newSubfolderId = await db.subfolders.add({
      name: subfolderName,
      folderId: folder.id,
    });
    subfolder = { id: newSubfolderId, name: subfolderName, folderId: folder.id };
  }

  const prayerId = await db.prayers.add({
    title,
    content,
    subfolderId: subfolder.id,
    folderId: folder.id,
  });

  return { id: prayerId };
}
