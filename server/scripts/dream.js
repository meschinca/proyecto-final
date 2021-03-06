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
      const formattedTags = dream.tags.split(",").map(tag => tag.trim());
      // Creamos el objeto sueño y luego lo insertamos en la base de datos
      const newDream = {
        title: dream.title,
        abstract: dream.abstract,
        body: dream.body,
        author: dream.author,
        tags: formattedTags,
        date: new Date().toISOString(),
        visibility: dream.visibility
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
 * addComment agrega un comentario al sueño que se está viendo
 * @param {string} comment el comentario a agregar
 * @param {string} id el sueño a comentar
 * @param {function} cb el callback
 */
const addComment = (comment, id, author, cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const dreamsCollection = Pernoctario.collection("dreams");
      // Busco el sueño con el id
      dreamsCollection.updateOne({ _id: new db.mongodb.ObjectID(id) }, { $push: { comments: { comment: comment, author: author } } }, (err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          cb({
            success: true,
            message: "Se agregó el comentario."
          });
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
 * @param {object} user el objeto usuario del que realiza la solicitud
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
              visibility: match.visibility,
              date: match.date,
              comments: match.comments
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
          match = match.map(dream => ({
            oid: dream._id.toString(),
            title: dream.title,
            abstract: dream.abstract,
            body: dream.body,
            author: dream.author,
            tags: dream.tags,
            visibility: dream.visibility,
            date: dream.date,
            comments: dream.comments
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
 * @param {function} cb la función callback
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
      dreamsCollection.find({ tags: { $in: tags } }).toArray((err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          match = match.map(dream => ({
            oid: dream._id.toString(),
            title: dream.title,
            abstract: dream.abstract,
            body: dream.body,
            author: dream.author,
            tags: dream.tags,
            visibility: dream.visibility,
            date: dream.date,
            comments: dream.comments
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

/**
 * getLastFiveDreams busca los 5 últimos sueños añadidos a la base de datos
 * @param {function} cb la función callback
 */
const getLastFiveDreams = (cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const dreamsCollection = Pernoctario.collection("dreams");
      // Hago una búsqueda en la colección para los sueños añadidos recientemente 
      dreamsCollection.find().toArray((err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          // Cambio el formato de fecha, los ordeno de últimos a primeros y tomo los 5 primeros elementos del array
          match = match.map(dream => ({
            oid: dream._id.toString(),
            title: dream.title,
            abstract: dream.abstract,
            body: dream.body,
            author: dream.author,
            tags: dream.tags,
            visibility: dream.visibility,
            date: Date.parse(dream.date),
            comments: dream.comments
          })).sort((a, b) => { return (b.date - a.date) }).slice(0, 5);
          cb({
            success: true,
            dreams: match,
            message: "Estos son los últimos 5 sueños añadidos"
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
  addComment,
  getDreamById,
  getDreamByAuthor,
  getDreamsByTags,
  getLastFiveDreams
}