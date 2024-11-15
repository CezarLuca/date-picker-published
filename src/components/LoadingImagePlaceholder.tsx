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
            className="bg-gray-800 rounded animate-pulse flex items-center justify-center"
        >
            <svg
                className="w-8 h-8 text-gray-600"
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
        </div>
    </div>
);

export default LoadingImagePlaceholder;
