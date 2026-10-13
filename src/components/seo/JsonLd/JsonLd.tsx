export interface JsonLdProps {
    data: Record<string, unknown>;
}

// "<" is escaped so a text containing "</script>" cannot end the tag and inject markup
export const JsonLd = ({ data }: JsonLdProps) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/</g, "\\u003c"),
        }}
    />
);
