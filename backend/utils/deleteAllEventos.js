const { db } = require('../firebase-config');

async function deleteAllEventos() {
  const snapshot = await db.collection('eventos').get();
  if (snapshot.empty) {
    console.log('No hay eventos para eliminar.');
    return;
  }
  const batch = db.batch();
  snapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log('Todos los eventos eliminados.');
}

deleteAllEventos().then(() => process.exit()).catch(e => { console.error(e); process.exit(1); }); 