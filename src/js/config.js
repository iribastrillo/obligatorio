const DEBUG = false;
let ID = 0;

const ERRORS = {
    WRONG_USERNAME_OR_PASSWORD: 'El nombre de usuario o contraseña no es correcto.',
    EMPTY_USERNAME: 'Debes ingresar un nombre de usuario.',
    EMPTY_PASSWORD: 'Debes ingresar una contraseña.',
    
}

const MESSAGES = {
    WELCOME: 'Bienvenido',
    INVITATION: '¡Aún no estás en el sistema! ¡Regístrate y comienza a usar la aplicación!',
    LOGIN_SUCCESS: '',
    SIGNUP_USER: '¡Registrate como usuario!',
    SIGNUP_COMPANY: '¡Registrate como empresa!',
}

const PACKAGE_STATUS = {
    FINISHED : 'Finished',
    PENDING : 'Pending',
    IN_PROCESS : 'In Process'
}

const TRIGGERS = {
    ADD_VEHICLE : 'add_vehicle',
    BACK_TO_PREVIOUS : 'back_to_previous',
    CREATE_ACCOUNT : 'create_account',
    ENABLE_COMPANY : 'enable_company',
    USER_LOGIN : 'user_login',
    USER_LOGOUT : 'user_logout',
    USER_SIGNUP : 'user_signup',
    SEE_MORE : 'see_more',
    SEE_STATISTICS: 'see_statistics',


    // Evento especial, en el sentido que maneja la transición de un estado 
    // a otro (una pantalla a otra):

    MANAGE_TRANSITION : 'transition'
}

const USER_LOGIN_ERROR = 'user_login_error';

//

const ROUTES = {
    admin_only : [TRIGGERS.ADD_VEHICLE, TRIGGERS.ENABLE_COMPANY],
    company_only : [],
    person_only: [],
    unrestricted: [TRIGGERS.SEE_MORE, TRIGGERS.CREATE_ACCOUNT]
}


