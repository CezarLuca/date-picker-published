interface LoadingPlaceholderProps {
    width?: number;
    height?: number;
}

const LoadingImagePlaceholder: React.FC<LoadingPlaceholderProps> = ({
    width = 150,
    height = 150,
}) => (
    <div className="relative">
        <div
            style={{ width: `${width}px`, height: `${height}px` }}
            className="bg-gray-600 rounded animate-pulse flex flex-col items-center justify-center border-2 border-gray-500 shadow-inner relative overflow-hidden"
        >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-gray-500/10 to-transparent" />

            <svg
                className="w-10 h-10 text-gray-400 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
            <span className="text-gray-400 text-sm mt-2">Loading...</span>
        </div>
    </div>
);

export default LoadingImagePlaceholder;
