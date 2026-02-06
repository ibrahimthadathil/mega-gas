import { Rootstate } from "../index.js";

export const selectAuth = (state: Rootstate) => state.user;
export const selectIsAuthenticated = (state: Rootstate) => state.user.is_authenticated;
export const selectUserRole = (state: Rootstate) => state.user.role;
export const selectUserName = (state: Rootstate) => state.user.user_name;
export const isAdmin = (state:Rootstate)=>state.user.role==='admin'||state.user.role==='manager'||state.user.role==='accountant'