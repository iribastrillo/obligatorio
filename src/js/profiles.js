class Admin {
    constructor (username, password) {
        this.username = username;
        this.password = password;
    }
}

class Person {
    constructor (first_name, last_name, ci, username, password) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.ci = ci;
        this.username = username;
        this.password = password;
    }
}

class Company {
    constructor (fantasy, rut, social, username, password) {
        this.fantasy = fantasy;
        this.rut = rut;
        this.social = social;  
        this.username = username;
        this.password = password;
    }
}


/*
    FUNCIONES CREATE: reciben datos de los handlers y devuelven el objeto
    que corresponde.
*/


function create_company (data) {
    return new Company (
        data.fantasy,
        data.social,
        data.rut,
        data.username,
        data.password,
    )
}

function create_person (data) {
    return new Person (
        data.first_name,
        data.last_name,
        data.ci,
        data.username,
        data.password,
    )
}