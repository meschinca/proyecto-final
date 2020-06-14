const db = require("./dbReqs");


/**
 * registerNewUser registra a los nuevos usuarios en la base de datos
 * @param {string} username el nombre de usuario a registrar
 * @param {string} password la contraseña elegida
 * @param {function} cb el callback para validar el registro
 */
const registerNewUser = (username, password, cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const usersCollection = Pernoctario.collection("users");
      // Creamos el usuario y luego lo insertamos en la base de datos
      const newUser = {
        user: username,
        password: password
      };
      usersCollection.insertOne(newUser, (err, result) => {
        if (err) {
          cb({ success: false });
        } else {
          cb({ success: true, /*user: username*/ });
        }
        // Cerramos la conexión con la base de datos
        client.close();
      });
    }
  });
};

/**
 * login comapara las credenciales entregadas y las busca en la base de datos para validar el inicio de sesión
 * @param {string} username el nombre de usuario usado
 * @param {string} password la contraseña correspondiente
 * @param {function} cb el callback para devolver la validación del ingreso
 */
const login = (username, password, cb) => {
  // Primero se conecta a la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const usersCollection = Pernoctario.collection("users");
      // Ahora buscamos en la colección un objeto que contenga las mismas credenciales
      usersCollection.findOne({ user, password }, (err, match) => {
        // Si hubo un error devolvemos success también como false
        if (err) {
          cb({ success: false });
        } else {
          // Si no lo encuentra la operación se efectuó pero no se valida el ingreso
          if (!match) {
            cb({ success: false, errMessage: "Usuario ya existente. Pruebe con otro nombre de usuario" });
          } else {
            // Si lo encontró, las credenciales son válidas y autorizamos el ingreso
            cb({ success: true, user: username, password: password });
          }
          // Cerramos la conexión a la base de datos
          client.close();
        }
      });
    }
  });
}

/**
 * getUser busca el nombre de usuario dado en la base de datos
 * @param {string} username el nombre de usuario a buscar
 * @param {function} cb el callback para entregar el resultado
 */
const getUser = (username, cb) => {
  // Primero se conecta a la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const usersCollection = Pernoctario.collection("users");
      // Buscamos al usuario en la colección y si lo encuentra devolvemos el objeto con success: true y user: result al cb
      usersCollection.findOne({ user: username }, (err, match) => {
        if (err) {
          cb({
            success: false
          });
        } else {
          cb({
            success: true,
            user: match
          });
        }
        // Cerramos la conexión a la base de datos
        client.close();
      });
    }
  });
};

module.exports = {
  registerNewUser,
  getUser,
  login
}
