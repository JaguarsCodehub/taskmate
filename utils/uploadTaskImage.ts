import { supabase } from "./supabase";

const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const uploadTaskImage = async (uri: string): Promise<string | null> => {
    try {
        const fileName = generateUUID() + '.jpg';
 
        const formData = new FormData();
        formData.append('file', {
            uri,
            name: fileName,
            type: 'image/jpeg',
        } as any);


        const {data, error} = await supabase.storage
            .from('completed_tasks')
            .upload(fileName, formData, {
                contentType: 'image/jpeg',
            })

        if(error) {
            console.error('Error Uploading Image:', error.message);
            return null;
        }

        const {data: publicUrlData,} = supabase
            .storage
            .from('completed_tasks')
            .getPublicUrl(data.path);

            return publicUrlData.publicUrl;
        
    } catch (error) {
        console.error('Error Uploading Image:', error);
        return null;
    }
}