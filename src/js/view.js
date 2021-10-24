///////////////////////////////////////////////////////////////

/* 

    Sobre view.js y el OBJETO VIEW:

    Por acá pasa todo lo que tiene que ver con la forma en que se
    ve la aplicación en el navegador. Cuando la aplicación se
    inicializa en app.initialize () se ejecuta ahí la función
    app.register (ids), que toma elementos del HTML a través de una
    lista de IDS (registrada en la variable IDS definida más abajo) y
    crea instancias de objetos View asociados a ese elemento HTML.
    De esta forma se puede definir un ELEMENTO REACTIVO al ESTADO INTERNO
    de la aplicación.

    MANUAL:

    1. Escribir en el HTML el elemento que se quiere hacer reactivo
    a una variable interna del sistema (por ejemplo, que muestre
    una lista de las empresas registras en DB.companies) con un id
    único, descriptivo, de la forma "app-componente_reactivo"
    (el prefijo app- va seguido de guion, y después se usa guión bajo,
    detalle muy importante).

    2. Registrar ese id en la variable IDS (que está abajo definida) SOLO
    ESCRIBIENDO EL ID SIN EL PREFIJO "app-".

    3. Definir una función view, con un nombre descriptivo que indique
    qué se está asociando con qué y ahí adentro manipular el objeto view.
    Siguiendo el ejemplo podríamos poner que componente_reactivo se vea solo
    cuando el app.state es "signup" de la forma:

        3.1. (Adentro de la función view que estoy definiendo) 
        app.views.componente_reactivo.display_in (app.state.signup).

        3.2. Cualquier otra modificación que se quiera reflejar puede hacerse 
        con métodos del objeto, por ejemplo, componente_reactivo.update_content (...)
        y con funciones de utils.js para la manipulación del HTML.

    4. Finalmente, registrar esa función view en la variable VIEWS. Por ejemplo:

        4.1. const VIEWS =  [
            ...                             
            view_componente_reactivo   <===== ACÁ la función view que se definió
            ...
        ]

*/

class View {
    constructor (id, element) {
        this.id = id;
        this.element = element;
    }
    bind (id, value) {
        get_element(id).innerHTML = value;
    }
    display_in (state) {
        this.element.hidden = !state;
    }
    get_element (id) {
        get_element (id);
    }
    update_content (msg) {
        this.element.innerHTML = msg;
    }
}

///////////////////////////////////////////////////////////////

/*
    REGISTRO DE COMPONENTES DE LA APLCACIÓN:
*/

const IDS = [
    'admin_enabling',
    'admin_panel',
    'admin_add_vehicle',
    'content',
    'list_vehicles', 
    'login',
    'login_errors',
    'navbar', 
    'signup',
    'signup_person',
    'statistics', 
    'welcome',
    'app-enable'
];

///////////////////////////////////////////////////////////////

/*
    FUNCIONES VIEW:

    Las funciones view ligan valores o atributos de un elemento
    o elementos en el documento HTML a una variable (o variables) interna del
    sistema. De ese modo en el paso app.update() que se ejecuta después de 
    un app.dispatch(...) el documento HTML reacciona al nuevo estado interno.
*/
function view_enable () {
    app.views.enable.display_in (app.state.enabling);
}

function view_login () {
    app.views.login.display_in (app.state.login);
}

function view_content () {
    if (app.session_user) {
        app.views.welcome.update_content (`${MESSAGES.WELCOME}, ${app.session_user.username}`);
    }
    app.views.content.display_in (app.logged_in);
}

function view_navbar () {
    if (app.state.signup) {
        hide (get_element('event-logout'));
    } else {
        display (get_element('event-logout'));
    }
    app.views.navbar.display_in (app.logged_in || app.state.signup);
}

function view_admin_panel () {
    app.views.statistics.display_in (app.logged_in && true);
    app.views.admin_panel.display_in (app.logged_in && true);
}

function view_signup () {
    let signup_user_type = get_element ('event-i-am').value;
    if (app.state.signup && signup_user_type == 'P') {
        display (get_element('person-fields'));
        hide (get_element ('company-fields'));
        inject (get_element('signup-message'), MESSAGES.SIGNUP_USER, 'span');
    } else if (app.state.signup && signup_user_type == 'C') {
        display (get_element('company-fields'));
        hide (get_element ('person-fields'));
        inject (get_element('signup-message'), MESSAGES.SIGNUP_COMPANY, 'span');
    }
    app.views.signup.display_in (app.state.signup);
}

function view_admin_enabling () {
    app.views.admin_enabling.display_in (app.state.enabling);
}

function view_list_vehicles () {
    if (app.session_user) {
        let list = '';
        for (let vehicle of DB.vehicles) {
            list += createHTML (vehicle, 'li');
        }
        app.views.list_vehicles.update_content (list);
    }
}

function view_admin_add_vehicle () {
    app.views.admin_add_vehicle.display_in (app.state.logged_in);
}

///////////////////////////////////////////////////////////////

/*
    REGISTRO DE VIEWS:
*/

const VIEWS = [
    view_login,
    view_content,
    view_navbar,
    view_admin_panel,
    view_admin_add_vehicle,
    view_signup,
    view_admin_enabling,
    view_list_vehicles
]

///////////////////////////////////////////////////////////////

/*
    FUNCIONES HANDLER:

    Las funciones handler se encargan de tomar los eventos de la
    página y despachan un evento - con datos si corresponde - que
    es atendido por un controller para manejar el estado interno 
    del sistema acordemente.
*/

function handle_enable_company () {
    app.dispatch (ADMIN_ENABLE_COMPANY);
}

function handle_user_login () {
    let data = {
        username: fetch_data('username'),
        password: fetch_data ('password')
    }
    app.dispatch (USER_LOGIN, data);
}

function handle_logout () {
    app.dispatch (USER_LOGOUT);
}

function handle_user_signup () {
    let user_type = fetch_data ('app-event-i-am');
    let data = {
        user_type: user_type,
        username: fetch_data ('new-username'),
        password: fetch_data ('new-password'),
        confirm_password: fetch_data ('new-password-confirm'),
    }
    switch (user_type) {
        case "C":
            data.fantasy = fetch_data ('fantasy');
            data.social = fetch_data ('social');
            data.rut = fetch_data ('rut'); 
            app.dispatch (USER_SIGNUP, {user_type: user_type, new_user: create_company(data)} );
            break;
        case "P":
            data.first_name = fetch_data ('first_name');
            data.last_name = fetch_data ('last_name');
            data.ci = fetch_data ('ci');
            app.dispatch (USER_SIGNUP, {user_type: user_type, new_user: create_person(data)});
            break;
    }
}

function handle_user_statistics () {
    alert ('Function statistics');
}

function handle_create_account () {
    app.dispatch (CREATE_ACCOUNT);
}

function handle_back () {
    app.dispatch (BACK_TO_PREVIOUS);
}

function handle_add_vehicle () {
    let  data = {
        vehicle: fetch_data ('vehicle')
    }
    app.dispatch (ADD_VEHICLE, data);
}
function handle_take_order () {
    
}

function handle_i_am_select_change () {
    app.dispatch (CREATE_ACCOUNT);
}   

///////////////////////////////////////////////////////////////

/*
    REGISTRO DE HANDLERS:
*/

const HANLDERS = {
    click: {
        'event-login': handle_user_login,
        'event-back': handle_back,
        'event-logout': handle_logout,
        'event-create-account': handle_create_account,
        'event-user-signup': handle_user_signup,
        'event-add-vehicle': handle_add_vehicle
    },
    change: {
        'event-i-am': handle_i_am_select_change
    }
}

///////////////////////////////////////////////////////////////