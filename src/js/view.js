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
    'admin_add_vehicle',
    'list_vehicles', 
    'login',
    'login_errors',
    'signup',
    'signup_person',
    'statistics', 
    'see_more'
];

///////////////////////////////////////////////////////////////

/*
    FUNCIONES VIEW:

    Las funciones view ligan valores o atributos de un elemento
    o elementos en el documento HTML a una variable (o variables) interna del
    sistema. De ese modo en el paso app.update() que se ejecuta después de 
    un app.dispatch(...) el documento HTML reacciona al nuevo estado interno.
*/

function view_login () {
    app.views.login.display_in (app.state.login);
}

function view_create_account () {
    let signup_user_type = get_element ('event-i-am').value;
    if (app.state.create_account && signup_user_type == 'P') {
        display (get_element('person-fields'));
        hide (get_element ('company-fields'));
        inject (get_element('signup-message'), MESSAGES.SIGNUP_USER, 'span');
    } else if (app.state.create_account && signup_user_type == 'C') {
        display (get_element('company-fields'));
        hide (get_element ('person-fields'));
        inject (get_element('signup-message'), MESSAGES.SIGNUP_COMPANY, 'span');
    }
    app.views.signup.display_in (app.state.create_account);
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
    let that_state = app.logged_in && app.state.add_vehicle; 
    app.views.admin_add_vehicle.display_in (that_state);
}

function view_see_more () {
    app.views.see_more.display_in (app.state.see_more)
}

function view_panel () {
    if (app.logged_in) {
        if (is_admin (app.session_user)) {
           display (get_element('admin-panel'))
           hide (get_element ('company-panel'))
           hide (get_element ('person-panel'))
        } else if (is_person(app.session_user)) {
            display (get_element('person-panel'))
            hide (get_element ('company-panel'))
            hide (get_element ('admin-panel'))
        } else if (is_company(app.session_user)) {
            display (get_element('company-panel'))
            hide (get_element ('admin-panel'))
            hide (get_element ('person-panel'))
        }
    } else {
        hide (get_element ('admin-panel'))
        hide (get_element ('person-panel'))
        hide (get_element ('company-panel'))
    }

}

function view_admin_enabling () {
    let that_state = app.state.enable_company && app.logged_in; 
    if (that_state) {
        let rows = '';
        let query = fetch_data ('search');
        let data = [];
        // Hay que implementar la funcionalidad de buscar
        for (let user of DB.users) {
            if (is_company(user)) {
                let data = '';
                data += createHTML (user.rut, 'td');
                data += createHTML (user.social, 'td');
                data += createHTML (user.fantasy, 'td');
                data += createHTML (user.enabled ? 'Habilitada' : 'Deshabilitada', 'td');
                rows += createHTML (data, 'tr');
            }
        }
        inject (get_element('company-list'), rows);
    }
    app.views.admin_enabling.display_in (that_state)
}
///////////////////////////////////////////////////////////////

/*
    REGISTRO DE VIEWS:
*/

const VIEWS = [
    view_login,
    view_admin_add_vehicle,
    view_create_account,
    view_list_vehicles,
    view_see_more,
    view_admin_enabling,
    view_panel
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
    app.dispatch (TRIGGERS.USER_LOGIN, data);
}

function handle_logout () {
    app.dispatch (TRIGGERS.USER_LOGOUT);
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
            app.dispatch (
                TRIGGERS.USER_SIGNUP,
                {user_type: user_type, new_user: create_company(data)} );
            break;
        case "P":
            data.first_name = fetch_data ('first_name');
            data.last_name = fetch_data ('last_name');
            data.ci = fetch_data ('ci');
            app.dispatch (
                TRIGGERS.USER_SIGNUP,
                {user_type: user_type, new_user: create_person(data)});
            break;
    }
}

function handle_back () {
    app.dispatch (TRIGGERS.BACK_TO_PREVIOUS);
}

function handle_add_vehicle () {
    let  data = {
        vehicle: fetch_data ('vehicle')
    }
    app.dispatch (TRIGGERS.ADD_VEHICLE, data);
}

function handle_take_order () {
    
}

function handle_i_am_select_change () {
    app.dispatch (TRIGGERS.CREATE_ACCOUNT);
}

//////////////////////////////////////////////////////////////
/*
    Transición entre pantallas.
*/

function handle_see_statistics () {
    app.transition(TRIGGERS.MANAGE_TRANSITION, TRIGGERS.SEE_STATISTICS)
}

function handle_to_add_vehicle () {
    app.transition(TRIGGERS.MANAGE_TRANSITION, TRIGGERS.ADD_VEHICLE)
}

function handle_see_more () {
    app.transition (TRIGGERS.MANAGE_TRANSITION, TRIGGERS.SEE_MORE);
}

function handle_to_enable_company () {
    app.transition(TRIGGERS.MANAGE_TRANSITION, TRIGGERS.ENABLE_COMPANY)
}

function handle_create_account () {
    app.transition (TRIGGERS.MANAGE_TRANSITION, TRIGGERS.CREATE_ACCOUNT);
}

function handle_back () {
    app.transition (TRIGGERS.BACK_TO_PREVIOUS, app.previous);
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
        'event-add-vehicle': handle_add_vehicle,
        'event-see-more': handle_see_more,
        'event-to-add-vehicle': handle_to_add_vehicle,
        'event-to-enable-company': handle_to_enable_company
    },
    change: {
        'event-i-am': handle_i_am_select_change
    }
}

///////////////////////////////////////////////////////////////