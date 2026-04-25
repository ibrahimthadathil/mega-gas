import api from "@/services/axios-Instance/interceptor";
import { Accounts } from "@/types/types";
import axios from "axios";

export const createAccount = async (data: Accounts) => {
  try {
    const result = await api.post("/api/user/accounts", data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getAllAccountsParty = async () => {
  try {
    const result = await api.get("/api/user/accounts");
    return result.data;
  } catch (error) {
    throw error;
  }
};

// transaction api

export const createNewLineItem = async (data: any) => {
  try {
    const result = await api.post("/api/user/accounts/transactions", data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (id:string)=> {
   try {
    const {data} = await api.delete(`/api/user/accounts/${id}`)
    return data
   } catch (error) {
    throw error
   }
}

export const updateAccount = async (id:string,account:Accounts)=> {
  try {
    const {data} = await api.put(`/api/user/accounts/${id}`,account)
    return data
  } catch (error) {
    throw error
  }
}
