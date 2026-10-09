export interface MenuProps {
    className?: string;
}

export const Menu = ({ className }: MenuProps) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
    >
        <path d="M5 9h14M5 15h14" />
    </svg>
);
