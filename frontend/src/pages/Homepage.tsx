import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import NotificationMsg, { ENotificationType, NotificationMsgType } from "../components/NotificationMsg";
import ItemCard from "../components/ItemCard";

const Homepage: FunctionComponent = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [menuType, setMenuType] = useState<string>('current');
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationMsgType | null>(null);
  const location = useLocation();

  // Extract notification state from location state
  const notificationPassed = location.state?.notification as NotificationMsgType | undefined;
  // check the notification passed
  useEffect(() => {
    // Check if notification exists and display it
    if (notificationPassed) {
      console.log("Notification received:", notificationPassed);
      setNotification({
        type: notificationPassed.type,
        message: notificationPassed.message,
        orderItem: notificationPassed.orderItem,
        notificationIconFrame: notificationPassed.notificationIconFrame
      })

      setTimeout(() => {
        setNotification(null); // Clear notification from state
        navigate(location.pathname, { replace: true, state: {} }); // clear the notificationPassed
      }, 3000); // Example: Clear after 3 seconds
    }
  }, [notificationPassed]);

  // Fetch menu data from API
  const fetchMenu = useCallback(async () => {
    const url = "http://localhost:3000/api/menu/active";
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        if (response.status === 404) {
          setNotification({
            type: ENotificationType.NO_MENU,
            notificationIconFrame: '/notificationiconframe@2x.png',
            notificationBackgroundColor: '#ffeeaa'
          })
          console.log("Menu is empty.");
          return;
        }
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const menu = await response.json();
    
      if (menu && menu.menuItems.length > 0) {
        setMenuItems(menu.menuItems);
        setMenuType(menu.type);
        console.log("Menu data fetched successfully.");
      } else {
        setError("No menu available for the current time.");
        console.log("Menu is empty.");
      }
    } catch (err) {
      setError("Error fetching the menu. Please try again later.");
      console.error("Error fetching menu data:", err);
    }
  }, []);

  // fetch menu whenever the component renders
  useEffect(() => {
    fetchMenu();
  }, []);


  const onButtonContainerClick = useCallback(() => {
    navigate("/view-order");
  }, [navigate]);

  const onItemCardContainerClick = useCallback((id: string) => {
    navigate(`/item-detail/${id}`);
  }, [navigate]);

  const onRefreshButtonFrameIconClick = useCallback(() => {
    // Reload the menu
    window.location.reload();
  }, []);

  return (
    <div className="relative bg-white w-full h-[1024px] flex flex-col items-start justify-start">
      <main className="self-stretch bg-white flex flex-col items-start justify-start py-[43px] px-5 gap-[20px]">
        <header className="self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo sm:flex-row sm:gap-[1px] sm:items-start sm:justify-start">
          <div className="flex flex-row items-start justify-between">
            <b className="relative capitalize">{menuType} menu</b>
          </div>
          <img
            className="relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer"
            alt="Refresh Menu"
            src="/refreshbuttonframe@2x.png"
            onClick={onRefreshButtonFrameIconClick}
          />
          <div className="self-stretch flex-1 flex flex-col items-end justify-start py-0.5 px-3.5">
            <Button
              buttonText="View Order"
              onButtonContainerClick={onButtonContainerClick}
              buttonMinWidth="unset"
            />
          </div>
        </header>
        <div className="self-stretch flex flex-col items-start justify-start">
          <img
            className="self-stretch relative max-w-full overflow-hidden h-0.5 shrink-0 object-cover"
            alt=""
            src="/separator@2x.png"
          />
        </div>

        {/* Show notification if present */}
        {notification && (
          <NotificationMsg
            notificationIconFrame={notification.notificationIconFrame}
            type={notification.type}
            notificationBackgroundColor={notification.notificationBackgroundColor}
            secondaryMessage={notification.secondaryMessage}
            orderItem={notification.orderItem}
          />
        )}

        {/* Show error if there's an error fetching the menu */}
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <section className="self-stretch flex flex-row flex-wrap items-start justify-start py-6 px-px gap-[30px]">
            {menuItems.map((item: any, index: number) => (
              <ItemCard
                key={index}
                menuItem={item}
                itemCardItemImageFrameWidth="238px"
                itemCardItemImageIconWidth="unset"
                itemCardItemImageIconAlignSelf="stretch"
                itemCardItemImageIconOverflow="hidden"
                onItemCardContainerClick={() => { onItemCardContainerClick(item.menuItemId) }}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Homepage;
