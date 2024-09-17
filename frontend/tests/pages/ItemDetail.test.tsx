import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import fetchMock from "jest-fetch-mock";
import ItemDetail from "../../src/pages/ItemDetail";
import { MenuItemDTO } from "../../src/shared/types";

fetchMock.enableMocks();

const mockMenuItem: MenuItemDTO = {
  menuItemId: "1",
  name: "Test Item",
  description: "This is a test item.",
  price: 12.99,
  imageUrl: "test-image.png"
};

const renderComponent = () => {
  render(
    <Router>
        <Routes>
            <Route path="/item-detail/:id" element={<ItemDetail />} />
        </Routes>
    </Router>
  );
};

describe("ItemDetail", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.useFakeTimers(); // Mock timers to handle `setTimeout` in tests
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Run all pending timers
    jest.useRealTimers(); // Clean up fake timers
  });

  it("should render item details correctly when a valid menuItemId is provided", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockMenuItem));

    window.history.pushState({}, "Item Detail", "/item-detail/1");

    renderComponent();

    expect(await screen.findByText("Test Item")).toBeInTheDocument();
    expect(await screen.findByText("This is a test item.")).toBeInTheDocument();
    expect(await screen.findByText("$12.99")).toBeInTheDocument();
  });

  it("should display a notification when the menu item is not found", async () => {
    fetchMock.mockResponseOnce("", { status: 404 });

    window.history.pushState({}, "Item Detail", "/item-detail/1");

    renderComponent();

    expect(await screen.findByText("Menu not found")).toBeInTheDocument();
  });

  it("should handle errors gracefully", async () => {
    fetchMock.mockReject(() => Promise.reject("API is down"));

    window.history.pushState({}, "Item Detail", "/item-detail/1");

    renderComponent();

    expect(await screen.findByText("Error fetching menu item. Please try again later.")).toBeInTheDocument();
  });


  it("should navigate back to the homepage on back button click", async () => {
    fetchMock.mockResponseOnce(JSON.stringify(mockMenuItem));

    window.history.pushState({}, "Item Detail", "/item-detail/1");

    renderComponent();

    userEvent.click(screen.getByAltText("back"));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/homepage");
    });
  });
});
