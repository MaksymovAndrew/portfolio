export interface ArrowUpProps {
    className?: string;
}

export const ArrowUp = ({ className }: ArrowUpProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
);
