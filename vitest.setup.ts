import "@testing-library/jest-dom/vitest";
// Initialise i18next once for every test file; components using
// `useTranslation` need an initialised instance to render.
import "./src/i18n";
