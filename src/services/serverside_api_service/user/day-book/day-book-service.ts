import { get_Day_Book } from "@/repository/user/day-book/day-book-repository";

export const getDayBookDetails = async (filter:any) => {
  try {
    const { data, success } = await get_Day_Book(filter);
    if (success) return { success, data };
    else return { success };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};
