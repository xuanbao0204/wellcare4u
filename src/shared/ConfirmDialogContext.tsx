import {
    createContext,
    useContext,
    useState
} from "react";
import ConfirmDialog from "./components/ConfirmDialog";

type ConfirmOptions = {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
};

type ConfirmContextType = {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ConfirmContext =
    createContext<ConfirmContextType | null>(null);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);

    if (!context) {
        throw new Error(
            "useConfirm must be used inside ConfirmProvider"
        );
    }

    return context;
};

export const ConfirmProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [options, setOptions] =
        useState<ConfirmOptions | null>(null);

    const [resolver, setResolver] =
        useState<(value: boolean) => void>();

    const confirm = (
        options: ConfirmOptions
    ): Promise<boolean> => {
        setOptions(options);

        return new Promise((resolve) => {
            setResolver(() => resolve);
        });
    };

    const handleConfirm = () => {
        resolver?.(true);
        setOptions(null);
    };

    const handleCancel = () => {
        resolver?.(false);
        setOptions(null);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {options && (
                <ConfirmDialog
                    {...options}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
};