import { render } from "@testing-library/react";

import { JsonLd } from "components/seo/JsonLd";

describe("JsonLd", () => {
    it("should keep the data readable as JSON", () => {
        const data = { "@type": "Person", name: "Jane Example" };
        const { container } = render(<JsonLd data={data} />);

        expect(JSON.parse(container.textContent)).toEqual(data);
    });

    it("should never let a text close the script", () => {
        const name = "</script><img src=x>";
        const { container } = render(<JsonLd data={{ name }} />);

        expect(container.innerHTML).not.toContain(name);
        expect(JSON.parse(container.textContent)).toEqual({ name });
    });
});
