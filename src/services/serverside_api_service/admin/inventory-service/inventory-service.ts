import { getAllInventory } from "@/repository/admin/inventory/inventory-repository"
import { STATUS } from "@/types/types"

const getInventoryStatus = async()=>{
    try {
        const details = await getAllInventory()
        if(details)return { success:true , data:details }
        else throw Error (STATUS.NOT_FOUND.message)
    } catch (error) {
        return{success:false,message:(error as Error).message}
    }
}
export {getInventoryStatus}