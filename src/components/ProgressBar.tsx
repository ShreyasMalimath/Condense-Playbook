import { motion } from "framer-motion";

interface ProgressBarProps {
    progress: number; // 0 to 100
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
    return (
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    );
};
