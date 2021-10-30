/*
    REGISTRO DEL ESTADO INICIAL DE LA APLICACIÓN:

    Solo un valor puede estar en true al mismo tiempo.
*/

const STATE = {
    create_account: false,
    landing: false,
    login: true, // Estado inicial
    add_vehicle: false,
    enable_company: false,
    see_statistics: false,
    see_more: false
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
        new Company ('Gatos.com', 67890, 'Gatos', 'Don gato', 'gatos'),
        new Person ('Rodolfo', 'Mondolfo', '11111111', 'Rodo', 'mondolfo'),
    ],
    vehicles: ['Moto', 'Camioneta', 'Camión'],
    packages: [],
}

///////////////////////////////////////////////////////////////

/*
    INICIALIZACIÓN:
*/

const app = new App ();

window.addEventListener ('load', run);

function run () {
    let package = {
        vehicle : 'Barco',
        distance : 100,
        description : 'Un gran recado',
        image : 'imagen_falsa456.png',
        company : null,
        person : DB.users[0]
    }
    DB.packages.push (create_package(package))
    app.initialize ();
}

///////////////////////////////////////////////////////////////