
import { encryptTransform } from 'redux-persist-transform-encrypt';

export const encryptor = encryptTransform({
    secretKey: process.env.NEXT_PUBLIC_PERSISTER_KEY as string ,
    onError:(error:Error)=> {
        console.error("Encryption error:", error);
    },
})