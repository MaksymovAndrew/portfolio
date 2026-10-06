export interface ArrowDownProps {
    className?: string;
}

export const ArrowDown = ({ className }: ArrowDownProps) => (
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
        <path d="M12 4v16M6 14l6 6 6-6" />
    </svg>
);
