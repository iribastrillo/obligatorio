/*
    REGISTRO DEL ESTADO INICIAL DE LA APLICACIÓN:

    Solo un valor puede estar en true al mismo tiempo.
*/

const STATE = {
    login: true,
    signup: false,
    add_vehicle: false,
    enabling: false,
}

///////////////////////////////////////////////////////////////

/*
    BASE DE DATOS:
*/

let DB = {
    users: [ 
        new Admin ('sintesis', '12345'), 
        new Admin ('Admin', 'Admin01'),
        new Company ('Perros.com', 12345, 'Perros', 'Don perro', 'mascotas'),
        new Person ('Rodolfo', 'Mondolfo', '11111111', 'Rodo', 'mondolfo'),
    ],
    vehicles: ['Moto', 'Camioneta', 'Camión'],
    orders: [],
}

///////////////////////////////////////////////////////////////

/*
    INICIALIZACIÓN:
*/

const app = new App ();

window.addEventListener ('load', run);

function run () {
    app.initialize ();
}

///////////////////////////////////////////////////////////////