const db = require("./dbReqs");


/**
 * registerNewUser registra a los nuevos usuarios en la base de datos
 * @param {string} username el nombre de usuario a registrar
 * @param {string} password la contraseña elegida
 * @param {string} email la dirección de correo electrónico
 * @param {function} cb el callback para validar el registro
 */
const registerNewUser = (username, password, email, cb) => {
  // Primero se conecta con la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const usersCollection = Pernoctario.collection("users");
      // Creamos el usuario y luego lo insertamos en la base de datos
      const newUser = {
        username,
        password,
        email
      };
      usersCollection.insertOne(newUser, (err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          cb({ success: true, user: match.ops[0], message: "Usuario registrado con éxito." });
        }
        // Cerramos la conexión con la base de datos
        client.close();
      });
    }
  });
};

/**
 * loginUser comapara las credenciales entregadas y las busca en la base de datos para validar el inicio de sesión
 * @param {string} username el nombre de usuario usado
 * @param {string} password la contraseña correspondiente
 * @param {function} cb el callback para devolver la validación del ingreso
 */
const loginUser = (username, password, cb) => {
  // Primero se conecta a la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const usersCollection = Pernoctario.collection("users");
      // Ahora buscamos en la colección un objeto que contenga las mismas credenciales
      usersCollection.findOne({ username, password }, (err, match) => {
        // Si hubo un error devolvemos success también como false
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          // Si no lo encuentra la operación se efectuó pero no se valida el ingreso
          if (!match) {
            cb({ success: false, message: "El usuario no existe o la contraseña es icorrecta. Por favor intente nuevamente." });
          } else {
            // Si lo encontró, las credenciales son válidas y autorizamos el ingreso
            cb({ success: true, user: match, message: "Inicio de sesión exitoso." });
          }
          // Cerramos la conexión a la base de datos
          client.close();
        }
      });
    }
  });
}

/**
 * getUserByName busca el nombre de usuario dado en la base de datos
 * @param {string} username el nombre de usuario a buscar
 * @param {function} cb el callback para entregar el resultado
 */
const getUserByName = (username, cb) => {
  // Primero se conecta a la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const usersCollection = Pernoctario.collection("users");
      // Buscamos al usuario en la colección y si lo encuentra devolvemos el objeto con success: true y user: match al cb
      usersCollection.findOne({ username: username }, (err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          if (!match) {
            cb({ success: true, user: "", message: "No se encontró un usuario con ese nombre. Intente de nuevo." });
          } else {
            cb({ success: true, user: match, message: "Usuario encontrado." });
          }
        }
        // Cerramos la conexión a la base de datos
        client.close();
      });
    }
  });
};

/**
 * getUserByEmail busca el email del usuario dado en la base de datos
 * @param {string} email el correo del usuario a buscar
 * @param {function} cb el callback para entregar el resultado
 */
const getUserByEmail = (email, cb) => {
  // Primero se conecta a la base de datos
  db.MongoClient.connect(db.url, db.config, (err, client) => {
    // Si hubo problemas para conectarse devolvemos al callback el objeto success como false
    if (err) {
      cb({ success: false, message: "No se pudo conectar con el servicio de datos. Por favor intente nuevamente en otro momento." });
    } else {
      // Si se conectó a MongoDB, inicializamos la base de datos y la colección
      const Pernoctario = client.db("Pernoctario");
      const usersCollection = Pernoctario.collection("users");
      // Buscamos al usuario en la colección y si lo encuentra devolvemos el objeto con success: true y user: match al cb
      usersCollection.findOne({ email: email }, (err, match) => {
        if (err) {
          cb({ success: false, message: "Hubo un error en la solicitud de respuesta del servicio de datos. Por favor intente nuevamente en otro momento." });
        } else {
          if (!match) {
            cb({ success: true, message: "No se encontró un usuario con ese correo. Intente de nuevo." });
          } else {
            cb({ success: true, user: match, message: "Usuario encontrado." });
          }
        }
        // Cerramos la conexión a la base de datos
        client.close();
      });
    }
  });
};

module.exports = {
  registerNewUser,
  loginUser,
  getUserByName,
  getUserByEmail
}
