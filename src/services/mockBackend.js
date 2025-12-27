import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "santaverse_gallery";

export const mockBackend = {
    // Get all items
    getGallery: () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error("Error reading gallery:", error);
            return [];
        }
    },

    // Add new item
    addToGallery: ({ username, image }) => {
        try {
            const gallery = mockBackend.getGallery();
            const newItem = {
                id: uuidv4(),
                username: username || "Guest",
                image,
                likes: 0,
                views: 0,
                createdAt: new Date().toLocaleDateString()
            };

            gallery.push(newItem);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
            return newItem;
        } catch (error) {
            console.error("Error adding to gallery:", error);
            throw error;
        }
    },

    // Like an item
    likeItem: (id) => {
        try {
            const gallery = mockBackend.getGallery();
            const itemIndex = gallery.findIndex(i => i.id === id);

            if (itemIndex > -1) {
                gallery[itemIndex].likes += 1;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
                return gallery[itemIndex];
            }
            return null;
        } catch (error) {
            console.error("Error liking item:", error);
            return null;
        }
    },

    // View item (increment view count)
    viewItem: (id) => {
        try {
            const gallery = mockBackend.getGallery();
            const itemIndex = gallery.findIndex(i => i.id === id);

            if (itemIndex > -1) {
                gallery[itemIndex].views = (gallery[itemIndex].views || 0) + 1;
                localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
            }
        } catch (error) {
            console.error("Error viewing item:", error);
        }
    },

    // User Session Helper
    getUsername: () => {
        return localStorage.getItem("username");
    },

    setUsername: (name) => {
        localStorage.setItem("username", name);
    }
};
