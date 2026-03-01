type AuthListener = () => void;

let logoutListener: AuthListener | null = null;

export const authEvents = {
    onLogout: (callback: AuthListener) => {
        logoutListener = callback;
    },

    emitLogout: () => {
        logoutListener?.();
    },
};