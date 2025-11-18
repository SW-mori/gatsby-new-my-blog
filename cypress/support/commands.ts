/// <reference types="cypress" />

import { BASE_URL, LOGIN_TEST_ID } from "../constants";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit(`${BASE_URL}/login`);

  cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("email")}"]`).type(email);
  cy.get(`[data-testid="${LOGIN_TEST_ID.INPUT("password")}"]`).type(password);
  cy.get(`[data-testid="${LOGIN_TEST_ID.BUTTON}"]`).click();

  cy.wait(500);
  cy.url().should("eq", `${BASE_URL}/`);
});
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
