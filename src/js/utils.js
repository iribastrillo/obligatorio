///////////////////////////////////////////////////////////////

/*
    FUNCIONES DE MANIPULACIÓN DEL HTML:
*/

///////////////////////////////////////////////////////////////

function fetch_data (id_tag) {
    let data = document.querySelector(`#${id_tag}`).value;
    document.querySelector(`#${id_tag}`).value = '';
    return data;
}

function listen (id, e, handler) {
    document.querySelector(`#app-${id}`).addEventListener (e, handler);
}

function get_element (id) {
    return document.querySelector(`#app-${id}`);
}

function createHTML (msg, tag) {
    return `<${tag}>${msg}</${tag}>`;
}

function inject (element, msg, as){
    element.innerHTML = createHTML (msg, as);
}

function clearHTML (element) {
    element.innerHTML = '';
}

function display (element) {
    element.hidden = false;
} 

function hide (element) {
    element.hidden = true;
}

///////////////////////////////////////////////////////////////

/*
    FUNCIONES DE VALIDACIÓN:
*/

///////////////////////////////////////////////////////////////

function is_logged_in () {
    return app.session_user != null;
}

function is_user (user) {
    let is_user = false;
    for (let u of DB.users) {
        if (user.username == u.username && user.password == u.password) {
            is_user = true;
        }
    }
    // Falta agregar funcionalidad => para ver si es Persona o Empresa.
    return is_user;
}

function validate_ci (ci) {
    /*
        Toma un número de cédula y devuelve true en caso que sea 
        un número de cédula válido, y false en caso contrario.
    */
    const VALDATOR = '2987634';
    let dv = ci.charAt(ci.length - 1);
    let s = 0;
    if (ci.length < 8) {
      for (let j = 0; j < (8 - ci.length); j++) {
        ci = '0' + ci;
      }
    }
    for (let i = 0; i < ci.length - 1; i++) {
      s += Number (ci.charAt(i)) * Number (VALDATOR.charAt(i))
    }
    return (10 - s%10) == dv;
  }

function validate_username (username) {
    /*
        Devuelve verdadero o falso si el nombre de usuario es válido.
    */
   let valid_username = true;
   for (let user of DB.admins) {
        if (username == user.username) {
            valid_username = false;
        }
   }
   return valid_username;
}

function validate_password (password) {
    /*
        Devuelve verdadero o falso si la contraseña cumple los
        requisitos que se piden.
    */
   let valid_length = false;
   let valid_uppercase = false;
   let valid_lowercase = false;
   let valid_number = false;
   if (password.length >= 6) {
       valid_length = true;
   }
   for (let i = 0; i <= password.length; i++) {
       if (password.charCodeAt (i) >= 65 && password.charCodeAt (i) <= 90) {
           valid_uppercase = true;
       }
       if (password.charCodeAt (i) >= 97 && password.charCodeAt (i) <= 122) {
        valid_lowercase = true;
       }
       if (password.charCodeAt (i) >= 48 && password.charCodeAt (i) <= 57) {
        valid_number= true;
       }
   }
   return valid_length && valid_uppercase && valid_lowercase && valid_number;
}

function validate_password_confirm (password, confirm) {
    /*
        Devuelve verdadero o falso si la contraseña y la confirmación
        de la contraseña coinciden.
    */
   return password == confirm;
}

function validate_company_rut (rut) {
    /*
        Devuelve verdadero o falso si el rut es único o no.
    */
    let valid_rut = true;
    for(let company of DB.companies) {
        if (company.rut == rut) {
            valid_rut = false;
        }
    }     
    return valid_rut;
}



// company.rut = numero.

/*Razón social: debe ser un valor alfabético único en el sistema.
Nombre de fantasía: debe ser un valor alfanumérico.
Nombre de usuario: debe ser único en el sistema. En caso de que ya exista el nombre en el sistema se pedirá al usuario que ingrese un nombre de usuario nuevamente.
Contraseña: se deben ingresar un mínimo de seis caracteres, con al menos una mayúscula, una minúscula y un número. En caso de que no se cumplan estos requisitos se pedirá que se ingrese una contraseña nuevamente.

///////////////////////////////////////////////////////////////

/*
    FUNCIONES DE AUXILIARES:
*/

///////////////////////////////////////////////////////////////

