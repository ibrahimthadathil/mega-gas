import { unload_Slip } from "@/repository/user/stock/stockRepository"

const unloadSlipRegister = async ()=>{
    try {
        await unload_Slip()
    } catch (error) {
        throw (error as Error).message
    }
}

export { unloadSlipRegister }