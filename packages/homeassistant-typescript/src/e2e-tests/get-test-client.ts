import { TEST_HASS_HOST, TEST_HASS_PORT, TEST_HASS_TOKEN } from "../test-support/index.ts";
import { initialiseClient } from "../test-support/package-intercept.ts";
import { getConfig } from "../lib/core/index.ts";

export const getTestClient = async () => {
  process.env["HASS_HOST"] = TEST_HASS_HOST;
  process.env["HASS_PORT"] = String(TEST_HASS_PORT);
  process.env["HASS_TOKEN"] = TEST_HASS_TOKEN;

  const config = getConfig();

  return await initialiseClient(config);
};
