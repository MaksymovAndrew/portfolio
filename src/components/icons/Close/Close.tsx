export interface CloseProps {
    className?: string;
}

export const Close = ({ className }: CloseProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <path d="M6 6l12 12M18 6L6 18" />
    </svg>
);
