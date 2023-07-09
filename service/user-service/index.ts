export interface IUserServiceRegistration{
    name: string,
    email: string,
    phone_number: string,
    password: string,
}

export interface IUserServiceLogin{
    email: string,
    password: string
}