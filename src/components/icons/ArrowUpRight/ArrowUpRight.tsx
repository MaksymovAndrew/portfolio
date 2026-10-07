export interface ArrowUpRightProps {
    className?: string;
}

export const ArrowUpRight = ({ className }: ArrowUpRightProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M5 19L19 5M8 5h11v11" />
    </svg>
);
