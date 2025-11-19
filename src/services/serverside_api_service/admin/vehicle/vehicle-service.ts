import { add_vehicle } from "@/repository/admin/vehicle/vehicle-repository";
import { checkUserByAuthId } from "@/repository/user/userRepository";
import { Vehicle } from "@/types/types";

const addVehicle = async (data: Vehicle) => {
  try {
    const checkUser = await checkUserByAuthId(
      data?.created_by as string
    );
    data.created_by = checkUser.id
    const result = await add_vehicle(data);
    if (result) return { success: true };
    else throw new Error("Failed to Create");
  } catch (error) {
    console.log((error as Error).message, "ererer");
    throw new Error((error as Error).message);
  }
};

export { addVehicle };
