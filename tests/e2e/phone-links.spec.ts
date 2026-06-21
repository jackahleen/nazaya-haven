import { expect, test } from "@playwright/test";
import { toTelHref } from "../../src/utils/phone-links";

test("phone links use dialable hrefs", () => {
  expect(toTelHref("(415) 864-8848")).toBe("tel:+14158648848");
  expect(toTelHref("1-800-799-7233")).toBe("tel:+18007997233");
  expect(toTelHref("911")).toBe("tel:911");
  expect(toTelHref("988")).toBe("tel:988");
});
