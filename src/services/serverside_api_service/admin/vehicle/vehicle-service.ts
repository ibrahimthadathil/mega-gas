import { add_vehicle } from "@/repository/admin/vehicle/vehicle-repository";
import { Vehicle } from "@/types/types";

const addVehicle = async (data: Vehicle) => {
  try {
    const result = await add_vehicle(data);
    if (result) return { success: true };
    else throw new Error("Failed to Create");
  } catch (error) {
    console.log((error as Error).message, "ererer");

    throw new Error((error as Error).message);
  }
};

export { addVehicle };
