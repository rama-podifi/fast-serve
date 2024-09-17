import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Homepage from "../../src/pages/Homepage";
import { ENotificationType } from "../../src/components/NotificationMsg";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";

// Enable fetch mocking
fetchMock.enableMocks();

describe("Homepage Component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("should render menu items when API call is successful", async () => {
    // Mock API response with menu items
    const menuItemsMock = {
      menuItems: [
        { menuItemId: "1", name: "Item 1" },
        { menuItemId: "2", name: "Item 2" }
      ],
      type: "Lunch"
    };
    fetchMock.mockResponseOnce(JSON.stringify(menuItemsMock));

    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify API was called
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:3000/api/menu/active", {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    // Wait for the items to be rendered
    await waitFor(() => {
      expect(screen.getByText("Lunch menu")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
  });

  it("should display notification if passed via location state", async () => {
    const notificationMock = {
      type: ENotificationType.NO_MENU,
      message: "No menu available",
      notificationIconFrame: "/notificationiconframe@2x.png"
    };

    render(
      <MemoryRouter initialEntries={[{ pathname: "/home", state: { notification: notificationMock } }]}>
        <Routes>
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the notification to appear
    await waitFor(() => {
      expect(screen.getByText("Nothing currently listed as available, please refresh menu")).toBeInTheDocument();
    });
  });

  it("should display an error message if menu API call fails", async () => {
    // Mock API failure
    fetchMock.mockReject(new Error("API error"));

    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText("Error fetching the menu. Please try again later.")).toBeInTheDocument();
    });
  });

  it("should display 'No menu available for the current time' if menu is empty", async () => {
    // Mock API response with empty menu
    fetchMock.mockResponseOnce(JSON.stringify({ menuItems: [], type: "Dinner" }));

    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("No menu available for the current time.")).toBeInTheDocument();
    });
  });

  it("should navigate to view order page on button click", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<Homepage />} />
          <Route path="/view-order" element={<div>View Order Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Click the 'View Order' button
    const viewOrderButton = screen.getByText("View Order");
    userEvent.click(viewOrderButton);

    // Wait for the navigation to happen
    await waitFor(() => {
      expect(screen.getByText("View Order Page")).toBeInTheDocument();
    });
  });

  it("should reload the page on refresh button click", async () => {    
    // Use Object.defineProperty to mock window.location.reload
    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
        configurable: true,
        value: { ...window.location, reload: reloadMock },
    });

    render(
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<Homepage />} />
        </Routes>
      </MemoryRouter>
    );

    // Click the refresh button
    const refreshButton = screen.getByAltText("Refresh Menu");
    userEvent.click(refreshButton);

    // Verify that reload was called
    expect(reloadMock).toHaveBeenCalledTimes(1);

    // Cleanup after the test
    reloadMock.mockRestore();
  });
});
