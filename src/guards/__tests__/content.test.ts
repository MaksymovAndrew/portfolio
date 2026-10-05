import { source } from "content";

import { publicFiles } from "i18n/content";
import { validateContent } from "i18n/validate";

describe("content", () => {
    it("should have no content issues", () => {
        // a failure lists every issue with the path of its field
        expect(validateContent(source, publicFiles)).toEqual([]);
    });
});
