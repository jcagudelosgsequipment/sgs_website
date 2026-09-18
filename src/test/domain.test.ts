import { afterEach, describe, expect, it } from "vitest";

import { catalogPath, isRentalsHost, MAIN_DOMAIN_URL, withMainDomain } from "@/utils/domain";

const originalLocation = window.location;

function mockLocation(hostname: string, search = "") {
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      ...originalLocation,
      hostname,
      search,
    },
  });
}

describe("domain helper", () => {
  afterEach(() => {
    sessionStorage.clear();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("detects sgs.rentals and subdomains", () => {
    mockLocation("sgs.rentals");
    expect(isRentalsHost()).toBe(true);

    mockLocation("www.sgs.rentals");
    expect(isRentalsHost()).toBe(true);
  });

  it("detects local simulation with ?domain=rentals and persists it", () => {
    mockLocation("localhost", "?domain=rentals");
    expect(isRentalsHost()).toBe(true);

    mockLocation("localhost", "");
    expect(isRentalsHost()).toBe(true);
    expect(catalogPath()).toBe("/");
    expect(withMainDomain("/contacto")).toBe(`${MAIN_DOMAIN_URL}/contacto`);
  });

  it("treats the main site as the default host", () => {
    mockLocation("sgsequipment.com");
    expect(isRentalsHost()).toBe(false);
    expect(catalogPath()).toBe("/equipos");
    expect(withMainDomain("/contacto")).toBe("/contacto");
  });
});
