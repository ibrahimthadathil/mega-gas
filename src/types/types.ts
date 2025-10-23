export interface IUser {
    user_name :string,
    email:string,
    phone:string,
    password:string,
    role: userRole
}

export enum userRole {
    Admin = "Admin",
    Staff = "Staff",
    Sriver= "Driver",

} 