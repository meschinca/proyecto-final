const db = require("./dbReqs");

/**
 * createDream agrega un sueño a la colección
 * @param {object} dream el objeto sueño 
 * @param {*} cb la función callback
 */
const createDream = (dream, cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const dreamsCollection = Pernoctario.collection("dreams");
      // Procesamos los tags antes de agregarlos
      const formattedTags = dream.tags.split(",");
      // Creamos el objeto sueño y luego lo insertamos en la base de datos
      const newDream = {
        title: dream.title,
        abstract: dream.abstract,
        body: dream.body,
        author: dream.author,
        tags: formattedTags,
        date: new Date().toISOString()
      };
      dreamsCollection.insertOne(newDream, (err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          cb({ success: true, user: match.ops[0], message: "Sueño agregado al archivo con éxito." });
        }
        // Cerramos la conexión con la base de datos
        client.close();
      });
    }
  });
};

/**
 * getDreamById busca un sueño usando su id como parámetro y lo retorna con el oid 
 * @param {string} id el código identificatorio de mongo para el sueño
 * @param {function} cb la función callback
 */
const getDreamById = (id, cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const dreamsCollection = Pernoctario.collection("dreams");
      dreamsCollection.findOne({ _id: new db.mongodb.ObjectID(id) }, (err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          cb({
            success: true,
            dream: {
              oid: match._id.toString(),
              title: match.title,
              abstract: match.abstract,
              body: match.body,
              author: match.author,
              tags: match.tags,
              date: match.date
            },
            message: "Se encontró un sueño con la id especificada."
          });
        }
        // Cerramos la conexión con la base de datos
        client.close();
      });
    }
  });
};

/**
 * getDreamById busca los sueños usando su autor como parámetro y los retorna con el oid 
 * @param {string} author el usuario autor del sueño
 * @param {function} cb la función callback
 */
const getDreamByAuthor = (author, cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const dreamsCollection = Pernoctario.collection("dreams");
      dreamsCollection.find({ author: author }).toArray((err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          match = match.map(dream =>({
            oid: dream._id.toString(),
            title: dream.title,
            abstract: dream.abstract,
            body: dream.body,
            author: dream.author,
            tags: dream.tags,
            date: dream.date
          }));
          cb({
            success: true,
            dreams: match,
            message: "Se encontró un sueño con la id especificada."
          });
        }
        // Cerramos la conexión con la base de datos
        client.close();
      });
    }
  });
};

/**
 * getDreamsByTags busca sueños usando como parámetro los tags ingresados
 * @param {array} tags el array de etiquetas usadas como parámetro de búsqueda
 * @param {function} cb 
 */
const getDreamsByTags = (tags, cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const dreamsCollection = Pernoctario.collection("dreams");
      // Hago una búsqueda en la colección para los tags 
      dreamsCollection.find( { tags: { $in: tags } } ).toArray((err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          match = match.map(dream =>({
            oid: dream._id.toString(),
            title: dream.title,
            abstract: dream.abstract,
            body: dream.body,
            author: dream.author,
            tags: dream.tags,
            date: dream.date
          }));
          cb({
            success: true,
            dreams: match,
            message: "Se encontraron estas coincidencias."
          });
          // Cerramos la conexión con la base de datos
          client.close();
        }
      });
    }
  });
};

module.exports = {
  createDream,
  getDreamById,
  getDreamByAuthor,
  getDreamsByTags
}