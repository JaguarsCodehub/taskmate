import { supabase } from './supabase';

// Simple UUID generator for React Native
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const uploadImageAsync = async (uri: string): Promise<string | null> => {
    try {
        const localUri = uri;

        const formData = new FormData();
        formData.append('file', {
            uri: localUri,
            name: localUri.split('/').pop() || `photo-${generateUUID()}.jpg`,
            type: 'image/jpeg',
        } as any);

        const { data, error } = await supabase.storage
            .from('profiles')
            .upload(generateUUID() + '.jpg', formData, {
                contentType: 'image/jpeg',
            });

        if (error) {
            console.error('Error uploading image:', error.message);
            return null;
        }

        const { publicUrl } = supabase
            .storage
            .from('profiles')
            .getPublicUrl(data.path)
            .data;

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};
