import { Accounts } from "@/types/types";
import axios from "axios";

export const createAccount = async (data: Accounts) => {
  try {
    const result = await axios.post("/api/user/accounts", data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getAllAccountsParty = async () => {
  try {
    const result = await axios.get("/api/user/accounts");
    return result.data;
  } catch (error) {
    throw error;
  }
};

// transaction api

export const createNewLineItem = async (data: any) => {
  try {
    const result = await axios.post("/api/user/accounts/transactions", data);
    return result.data;
  } catch (error) {
    throw error;
  }
};
