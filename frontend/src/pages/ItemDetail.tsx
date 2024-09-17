import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ItemDetailsCard from "../components/ItemDetailsCard";
import NotificationMsg, { NotificationMsgType } from "../components/NotificationMsg";
import { MenuItemDTO } from "../shared/types";

const ItemDetail: FunctionComponent = () => {
  const [menuItem, setMenuItem] = useState<MenuItemDTO | null>(null);
  const [notification, setNotification] = useState<NotificationMsgType | null>(null);
  const { id: menuItemId } = useParams();
  const navigate = useNavigate();

  const fetchMenuItemDetails = useCallback(async () => {
    console.log(menuItemId, '<< menuItemId')
    if (!menuItemId) {
      setNotification({
        notificationIconFrame: '/notificationiconframe@2x.png',
        message: 'Invalid menu item id'
      })
      return;
    }

    try {
      console.log(`Fetching details for menu item with ID: ${menuItemId}`);
      const response = await fetch(`http://localhost:3000/api/menu/items/${menuItemId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setNotification({
            notificationIconFrame: '/notificationiconframe@2x.png',
            message: 'Menu not found'
          })
          console.log("Menu not found.");
          return;
        }
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const menuItemData = await response.json();

      if (menuItemData) {
        setMenuItem({
          ...menuItemData,
          imageUrl: `/${menuItemData.imageUrl}`
        });
        console.log("Menu item data fetched successfully:", menuItemData);
      } else {
        setNotification({
          notificationIconFrame: '/notificationiconframe@2x.png',
          message: 'Menu item is not found'
        })
        console.log("Menu item is empty or does not exist.");
      }
    } catch (err) {
      setNotification({
        notificationIconFrame: '/notificationiconframe@2x.png',
        message: 'Error fetching menu item. Please try again later.'
      })
      console.error("Error fetching menu item data:", err);
    } finally {
      setTimeout(() => {
        setNotification(null); // Clear notification from state
      }, 3000); // Example: Clear after 3 seconds
    }
  }, [menuItemId]); // Dependencies include menuItemId

  // Fetch the menu item details when the component mounts or menuItemId changes
  useEffect(() => {
    fetchMenuItemDetails();
  }, [fetchMenuItemDetails]);

  const onBackButtonFrameIconClick = useCallback(() => {
    navigate("/homepage");
  }, [navigate]);

  return (
    <div className="relative bg-white w-full h-[1024px] overflow-hidden flex flex-col items-start justify-start sm:flex-col">
      <section className="self-stretch flex flex-col items-start justify-start py-[43px] px-5 gap-[20px]">
        <header className="self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo">
          <img
            className="relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer"
            alt="back"
            src="/backbuttonframe@2x.png"
            onClick={onBackButtonFrameIconClick}
          />
          <div className="flex flex-row items-start justify-start">
            <b className="relative">Item Detail</b>
          </div>
        </header>
        <div className="self-stretch h-[1.1px] flex flex-col items-start justify-start">
          <img
            className="self-stretch relative max-w-full overflow-hidden h-0.5 shrink-0 object-cover"
            alt=""
            src="/separator@2x.png"
          />
        </div>
        {notification && (
          <NotificationMsg
            notificationIconFrame={notification.notificationIconFrame}
            type={notification.type}
            notificationBackgroundColor={notification.notificationBackgroundColor}
            secondaryMessage={notification.secondaryMessage}
            orderItem={notification.orderItem}
            message={notification.message}
          />
        )}
        { menuItem && (
          <div className="self-stretch flex flex-row items-start justify-center py-5 px-0">
            <ItemDetailsCard
              menuItem={menuItem}
              setNotification={setNotification}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default ItemDetail;
