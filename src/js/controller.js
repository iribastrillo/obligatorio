///////////////////////////////////////////////////////////////

/* 
    FUNCIONES CONTROLLER: 

    Son llamadas por un evento del sistema y se encargan de modificar
    la vista, los datos y el estado interno del sistema para que luego
    se modifique la presentación de la aplicación en consecuencia.
*/ 

function controller_login (data) {
    /* 
        Controla el cambio de estado desde "login" hacia "logged in".
        En caso de ser un usuario válido, inicia sesión y cambia el estado a
        "logged in". En caso contrario, manda un error.
    */
    if (is_user (data)) { 
        app.session_user = data;
        app.logged_in = true;
        let welcome = `Bienvenido, ${app.session_user.username}`
        clearHTML (get_element('login_errors'));
        app.set_state ('logged_in');
        alert (welcome);
    } else {
        data.errors = {
            'login_errors': ERRORS.WRONG_USERNAME_OR_PASSWORD
        };
    } 
}

function controller_logout () {
    /* 
        Controla el cambio de estado desde "logged in" a "login", es decir, 
        no estar ingresado.En caso de ser un usuario válido, inicia sesión y 
        cambia el estado a "logged_in". En caso contrario, manda un error.
    */
    if (app.session_user) {
        alert (`Vuelve pronto, ${app.session_user.username}!`);
        app.session_user = null;
        app.logged_in = false;
        app.set_state ('login');
    }
}

function controller_signup (data) {
    switch (data.user_type) {
        case 'C':
            //if (validate_username (data.username)) {
                // ...
            //}
            //if (validate_password(data.password)) {
                // ...
            //}
            //if (validate_password_confirm (data.password, data.confirm_password)) {
                // ...
            //}
            DB.users.push (data.new_user);
            app.set_state ('login');
            break;
        case 'P':
            DB.users.push (data.new_user);
            app.set_state ('login');
            // Antes de hacer el push, habría que validar todo.
            //DB.persons.push (data);
            break;
    }
}

function controller_create_account (data) {
    /*
        Controla la vista para crear un perfil nuevo dentro del sistema.
    */
    clearHTML (get_element('login_errors')); // Esto debería salir de acá
    app.set_state ('signup');
}

function controller_back_to_previous () {
    if ((is_logged_in (app.session_user) && app.previous != 'login') || app.state.signup) {
        app.set_state (app.previous);
    }
}

function controller_add_vehicle (data) {
    if (data.vehicle) {
        DB.vehicles.push (data.vehicle);
    } else {
        // Hay que hacer validaciones
        data.errors = {
            'add_vehicle_error' : 'Hubo un error...'
        }
    }
}


function controller_login_success_or_fail (data) {
    if (data.errors) {
        alert (MESSAGES.INVITATION);
        app.dispatch (USER_LOGIN_ERROR, data.errors);
    }
}

function controller_display_errors (errors) {
    for (let id in errors) {
        inject (get_element (id), errors[id], 'p')
    }
}


function controller_admin_enable_company () {
    app.set_state (app.state.enabling);
}
///////////////////////////////////////////////////////////////

// Cambiar de estado cuando se toman pedidos

/*
    REGISTRO DE CONTROLLERS:
*/

const CONTROLLERS = {
    'user_login': [
        (data) => controller_login (data), 
        (data) => controller_login_success_or_fail(data)],
    'back_to_previous': [() => controller_back_to_previous()],
    'user_login_error': [(errors) => controller_display_errors(errors)],
    'user_logout': [() => controller_logout()],
    'user_signup': [(data) => controller_signup(data)],
    'create_account': [() => controller_create_account()],
    'add_vehicle': [(data) => controller_add_vehicle(data)],
    'admin_enable_company' : [() => controller_admin_enable_company()]
}

///////////////////////////////////////////////////////////////