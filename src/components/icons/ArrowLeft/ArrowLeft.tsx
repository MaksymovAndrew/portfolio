export interface ArrowLeftProps {
    className?: string;
}

export const ArrowLeft = ({ className }: ArrowLeftProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
);
