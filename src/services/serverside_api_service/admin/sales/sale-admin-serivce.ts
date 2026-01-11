import { delete_sales } from "@/repository/admin/Dashboard/salesReport- repository"
import { checkUserByAuthId } from "@/repository/user/userRepository"


const deleteSaleSlip = async (authid:string,slipId:string) => {
    try {
        const checkUser = await checkUserByAuthId(authid)
        if(checkUser){
            const isDeleted = await delete_sales(slipId,checkUser.id)
            if(isDeleted)return {success:true,message:"Deleted successfully"}
            else return {success:false , message:'Failed to Delete'}
        }else throw Error('Unauthorized')
    } catch (error) {
        return {success:false,message:(error as Error).message}
    }
}

export {deleteSaleSlip}