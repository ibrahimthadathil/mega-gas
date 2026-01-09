import supabase from "@/lib/supabase/supabaseClient"

const get_All_Unload_Details = async()=>{
    try {
        const {data,error} = await supabase.from('plant_load_unload_view').select('*')
        if(error) throw error
        return data
    } catch (error) {
        throw error
    }
}

export {get_All_Unload_Details}