import { getAllProductsOptions } from "@/repository/user/sales/salesRepository"


const getDeliverableProduct = async () => {
    try {
        const product = await getAllProductsOptions()
        if(product)return {success:true,product}
        else return {success:false}
    } catch (error) {
        throw error
    }
}

export {getDeliverableProduct}