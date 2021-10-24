///////////////////////////////////////////////////////////////

/* 
    Sobre app.js y el OBJETO APP: 

    Es el objeto que controla el flujo general del sistema. Configura e
    inicializa la aplicación, almacena los datos de la sesión, mantiene
    registro del ESTADO INTERNO de la aplicación, despacha EVENTOS INTERNOS a 
    los controllers y activa el paso de actualización - app.update() - 
    de la información en pantalla. El paso app.update () activa todas las
    funciones view en view.js registradas en la variable VIEWS.

    La aplicación puede estar solamente en un ESTADO INTERNO, y cada estado se
    corresponde con una pantalla:

    1. login: ESTADO INTERNO inicial de la aplicación. Permite la pantalla login.
    2. signup: permite la pantalla crear nuevo usuario.
    ...

    INICIALIZACIÓN:

    1. Se inicializa la aplicación tras el evento "load" del objeto window.
        1.1. app.register(...IDS): mapea objetos en pantalla con instancias de
            objetos View, que facilitan la manipulación del documento HTML en
            view.js y, en particular, en las funciones view.
        1.3. app.setup (...CONTROLLERS): mapea EVENTOS INTERNOS del sistema con
            funciones controller para controlar el ESTADO INTERNO del sistema.
        1.2. app.bind (...EVENTS): mapea objetos en pantalla con eventos tipo
            "click", "change", etc.
        1.3. app.update (): dispara la primera actualización de datos en pantalla.

    FLUJO DE LA APLICACIÓN:

    =>

        1. El usuario dispara un evento desde la pantalla (a través de un click, por ejemplo).

    =>

        2. Una función handler dispara un EVENTO INTERNO asociado a ese evento del HTML 
        y lo despacha mediante app.dispatch (EVENTO_INTERNO, datos) con datos si fuera necesario 
        (porque se procesa un formulario, por ejemplo).

    =>

        3. Una función controller procesa el EVENTO INTERNO y los datos (si los hubiera), 
        modificando los datos (modelo) y modifica el ESTADO INTERNO de la aplicación
        mediante app.set_state (new_state).

    =>

        4. El objeto app pide a las vistas que actualicen su presentación mediante
        app.update ().
            4.1. Todas las funciones view registradas son llamadas por app.update () 
            y toman los datos y el ESTADO INTERNO del sistema (que puede haber cambiado 
            en 3.) y modifican la vista de la aplicación.

    =>

    5. La aplicación espera un nuevo evento en su nuevo estado (vuelve a 1.).

    ----------------------------------------------------------------------------------

    ACLARACIONES: 

     1. Por EVENTOS INTERNOS del sistema se refiere a eventos especialmente pensados
     para atender la lógica del problema a resolver. Son eventos diferentes a los 
     eventos del navegador y, básicamente, se encargan de activar funciones controller
     que ejecutan lógica, como modificar algo en la base de datos o cambiar el estado
     de la aplicación. Estos eventos se definen en config.js, se registran en app.js
     y se vinculan a controladores en controller.js. Ej.: "user_login" se dispara a
     través del botón "Ingresar" del login y lo controla la función controller_user_login (data)
     definada en controller.js.

            1.1. Para el ejemplo anterior el flujo sería:
                1.1.1. El usuario hace click en el botón "Ingresar" del login.
                1.1.2. La función handle_user_login () se llama, recoge los datos del 
                formulario (en este caso nombre de usuario y contraseña) y los despacha
                a través de app.dispatch(USER_LOGIN, datos).
                1.1.3. app.dispatch (...) pasa los datos a controller_user_login (datos)
                y allí se ejecuta la lógica de validar y, eventualmente, logear o no
                al usuario.
                1.1.4. controller_user_login (...) llama a app.set_state ("login") (en caso
                que no haya errores) o manda un error a través de un EVENTO INTERNO y cambia 
                el estado de la aplicación (o no).
                1.1.5. Después, se llama app.update () donde eventualmente se llama a las
                funciones view que están asociadas a datos del usuario logeado(por ejemplo,
                un h1 que diría "Bienvenido, nombre_de_usuario").

     2. Por ESTADO INTERNO del sistema se refiere, básicamente, a los atributos y datos
     contenidos en la instancia del objeto App y el modelo (variable DB en main.js). 
     El estado es, principalmente, al atributo app.state, que almacena una lista de 
     booleanos donde uno, y solo uno, puede tener el valor true. Ese estado cambia 
     a través de app.set_state (new_state) llamado por una función controller.

     3. Por ELEMENTO REACTIVO se refiere a un elemento HTML (como un div, un p, etc.) que
     está asociado a una instancia de objeto View y a una función (o funciones) view.
     Con este mecanismo se logra que elementos de la pantalla se actualicen automáticamente
     cuando algo cambia en el ESTADO INTERNO de la aplicación.

     4. Con el atributo app.subscriptions y el método app.dispatch (EVENTO_INTERNO, datos)
     básicamente se implementa el sistema de EVENTOS INTERNOS. Cada vez que hay un
     app.dispatch(...) lo que pasa es que se ejecuta la función controller - o las 
     funciones controller - asociada/s a ese evento en el atributo app.subscriptions.

     ----------------------------------------------------------------------------------

*/ 


class App {
    constructor () {
        this.views = {};
        this.subscriptions = {};
        this.previous = null;
        this.logged_in = false;
        this.current = 'login';
        this.session_user = null;
        this.state = STATE;
        this.last_event = null;
    }

    initialize () {
        /*
            Registra componentes, controladores y eventos.
        */

        // Se ejecutan una única vez.
        
        this.register (IDS);
        this.setup (CONTROLLERS);
        this.bind (HANLDERS);

        // Se ejectuta por primera vez acá, y luego cíclicamente como se detalla arriba.
        
        this.update();
    }

    bind (events) {
        for (let event_type in events) {
            for (let element in events[event_type]) {
                listen (element, event_type, events[event_type][element])
            }
        }
    }

    register (views) {
        for (let id of views) {
            let element = get_element (`${id}`);
            this.views[id] = new View (id, element);
        }
    }

    setup (controllers) {
        for (let controller in controllers) {
            this.subscriptions[controller] = [];
            this.subscribe (controller, controllers[controller]);
        }
    }

    update () {
        /* 
            Se actualizan componentes cargados en el sistema de acuerdo
            al valor de variables internas del programa. Se dispara luego
            de cada evento, y actualiza la vista de la aplicación.
        */
        for (let view of VIEWS) {
            /*
                Por cada ciclo del bucle for la variable view recorre
                cada una de las funciones del array View y la llama.

                Esas funciones, acá, pasan y se llaman con un alias, view ().
            */
            view ();
        }
        if (DEBUG) this.describe();
    }

    set_state (new_state) {
        /* 
            Esta función se encarga de actualizar el estado de la aplicación
            para que quede solamente en un estado definido entre todos los 
            posibles.
        */
        if (this.current != new_state) {
            this.previous = this.current;
            this.current = new_state;
        } 
        
        for (let key in this.state) {
            this.state[key] = false;
        } 
        this.state[new_state] = true;
    }

    subscribe (e, funcs) {
        for (let f of funcs) {
            this.subscriptions[e].push (f);
        }
    }

    dispatch (e, data) {
        // Se podria agregar middleware antes de despachar, para procesar cosas generales
        // del evento y los datos, etc.
        this.last_event = e;
        for (let f of this.subscriptions[e]) {
            f(data);
            
        }

        if (data) {
            if (data.errors) {
                console.log ('Hubo errores...');
            }
        }

        this.update ();
    }

    describe () {
        console.clear ();
        console.log (this); 
        console.log ('###############################');
        console.log ('EL ESTADO ACTUAL ES: ');
        console.log (this.current); 
        console.log ('###############################');
    }
}

///////////////////////////////////////////////////////////////