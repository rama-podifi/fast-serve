import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationMsg, { ENotificationType, NotificationMsgType } from "../components/NotificationMsg";
import OrderItem from "../components/OrderItem";
import Button from "../components/Button";
import { debounce } from "lodash";

interface OrderItemDTO {
  menuItemId: string;
  menuItemName: string;
  menuItemPrice: number;
  menuItemImageUrl?: string;
  quantity: number;
  itemTotal: number;
}

const ViewOrder: FunctionComponent = () => {
  const [orderItems, setOrderItems] = useState<OrderItemDTO[]>([]);
  const [totalOrderPrice, setTotalOrderPrice] = useState<number>(0);
  const [notification, setNotification] = useState<NotificationMsgType | null>(null);
  const navigate = useNavigate();

  // navigation
  const onBackButtonFrameIconClick = useCallback(() => {
    navigate("/homepage");
  }, [navigate]);

  // Fetch order items using useCallback to ensure stability between renders
  const fetchOrderData = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/menu/orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const orders = await response.json()

      if (orders.orderItems.length > 0) {
        setOrderItems(orders.orderItems)
        setTotalOrderPrice(orders.totalOrderPrice)
      } else {
        setNotification({
          notificationBackgroundColor: '#ffeeaa',
          notificationIconFrame: '/notificationiconframe@2x.png',
          message: 'You have nothing in this order'
        })
      }

    } catch (err) {
      setNotification({
        notificationBackgroundColor: '#ffeeaa',
        notificationIconFrame: '/notificationiconframe@2x.png',
        message: `${err}`,
      })
      console.error("Error fetching order items:", err);
    }
  }, []);

  // Fetch the order items when the component mounts
  useEffect(() => {
    fetchOrderData();
  }, [fetchOrderData]);

  // removeOrder
  const removeOrder = useCallback(async (menuItemId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/menu/orders/${menuItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const orders = await response.json()

      setNotification({
        notificationIconFrame: '/notificationiconsuccess.png',
        message: 'Item has been removed from your order'
      })


      setOrderItems(orders.orderItems)
      setTotalOrderPrice(orders.totalOrderPrice)

      if (orders.orderItems.length == 0) {
        setOrderItems(orders.orderItems)
        setTotalOrderPrice(orders.totalOrderPrice)
        setNotification({
          notificationBackgroundColor: '#ffeeaa',
          notificationIconFrame: '/notificationiconframe@2x.png',
          message: 'You have nothing in this order'
        })
      }

    } catch (err) {
      setNotification({
        notificationBackgroundColor: '#ffeeaa',
        notificationIconFrame: '/notificationiconframe@2x.png',
        message: `${err}`,
      })
      console.error("Error fetching order items:", err);
    } finally {
      setTimeout(() => {
        setNotification(null); // Clear notification from state
      }, 3000); // Example: Clear after 3 seconds
    }
  }, []);

  // updateOrder
  const updateOrder = useCallback( debounce(async (menuItemId: string, quantity: number) => {
    console.log('UPDATE ORDER CALLED with', menuItemId, 'id and', quantity, 'quantity')
    try {
      const response = await fetch(`http://localhost:3000/api/menu/orders/${menuItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const orders = await response.json()

      if (orders.orderItems.length > 0) {
        setOrderItems(orders.orderItems)
        setTotalOrderPrice(orders.totalOrderPrice)
      } else {
        setNotification({
          notificationBackgroundColor: '#ffeeaa',
          notificationIconFrame: '/notificationiconframe@2x.png',
          message: 'You have nothing in this order'
        })
      }

    } catch (err) {
      setNotification({
        notificationBackgroundColor: '#ffeeaa',
        notificationIconFrame: '/notificationiconframe@2x.png',
        message: `${err}`,
      })
      console.error("Error update order items:", err);
    }
  }, 2000), []);

  // confirm order
  const confirmOrder = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu/orders/confirm', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      navigate("/homepage", {
        state: {
          notification: {
            type: ENotificationType.ORDER_PLACED,
            notificationIconFrame: '/notificationiconsuccess.png',
          },
        },
      });

    } catch (err) {
      console.error("Error confirm order:", err);
      setNotification({
        notificationIconFrame: '/notificationiconframe@2x.png',
        notificationBackgroundColor: '#ffeeaa',
        message: `${err}`
      })
    }
  }, [])


  return (
    <div className="relative bg-white w-full h-[1024px] flex flex-col items-start justify-start">
      <main className="self-stretch flex-1 flex flex-col items-center justify-start py-[43px] px-5 gap-[10px] text-left text-base text-gray-300 font-aleo sm:flex-col">

        <header className="self-stretch flex flex-row items-start justify-start gap-[36px] text-left text-13xl text-gray-100 font-aleo">
          <img
            className="relative w-[37px] h-[37px] overflow-hidden shrink-0 object-cover cursor-pointer"
            alt="Back"
            src="/backbuttonframe@2x.png"
            onClick={onBackButtonFrameIconClick}
          />
          <div className="flex flex-row items-start justify-start">
            <b className="relative">Order Summary</b>
          </div>
        </header>
        <div className="self-stretch flex flex-col items-start justify-start py-2.5 px-0">
          <img
            className="self-stretch relative max-w-full overflow-hidden h-px shrink-0 object-cover"
            alt="Separator"
            src="/ordersummarytableheaderseparator@2x.png"
          />
        </div>

        {/* Notification Message */}
        { notification && (
          <NotificationMsg
            notificationBackgroundColor={notification.notificationBackgroundColor}
            message={notification.message}
            notificationIconFrame={notification.notificationIconFrame}
          />
        )}
        
        <section className="w-full flex flex-col items-start justify-start pt-[55px] px-0 pb-0 box-border gap-[9px] max-w-[1200px] text-left text-base text-gray-300 font-aleo sm:hidden">
          <div className="self-stretch flex flex-row items-start justify-start gap-[45px]">
            <div className="flex-1 flex flex-row items-start justify-start py-0 pr-0 pl-[180px] box-border max-w-[635px]">
              <div className="relative">Item</div>
            </div>
            <div className="flex-1 flex flex-row items-start justify-start max-w-[320px]">
              <div className="relative">Quantity</div>
            </div>
            <div className="flex flex-row items-center justify-start">
              <div className="relative">Total Price</div>
            </div>
          </div>
          <div className="self-stretch h-px flex flex-col items-start justify-start">
            <img
              className="self-stretch relative max-w-full overflow-hidden h-px shrink-0 object-cover"
              alt="Separator"
              src="/ordersummarytableheaderseparator@2x.png"
            />
          </div>
        </section>

          {/* Map over the fetched order items and render them */}
          {orderItems.map((item, index) => (
            <OrderItem
              key={index}
              menuItemId={item.menuItemId}
              itemName={item.menuItemName}
              itemPrice={`$${item.menuItemPrice.toFixed(2)}`}
              itemSubTotal={`$${item.itemTotal.toFixed(2)}`}
              itemQuantity={item.quantity}
              orderItemImage={item.menuItemImageUrl}
              orderItemSeparator="/orderitemseparator@2x.png"
              removeOrder={removeOrder}
              updateOrder={updateOrder}
            />
          ))}

          {/* Total Price */}
          <div className="w-full flex flex-row items-start justify-start gap-[10px] max-w-[1200px] sm:items-start sm:justify-start sm:pr-0 sm:box-border">
            <div className="flex-1 flex flex-row items-start justify-end p-2.5 box-border max-w-[1025px] sm:max-w-[250px]">
              <b className="relative inline-block w-[52.1px] h-[26.2px] shrink-0">
                Total:
              </b>
            </div>
            <div className="flex flex-row items-start justify-center p-2.5">
              <div className="relative inline-block w-[57.1px] h-[26.2px] shrink-0">
                {`$${totalOrderPrice.toFixed(2)}`}
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <div className="w-full flex flex-col items-end justify-start py-0 pr-[100px] pl-0 box-border max-w-[1200px] sm:pr-[55px] sm:box-border mq350small:pr-[15px] mq350small:box-border">
            <Button
              buttonText="Place Order"
              onButtonContainerClick={confirmOrder}
              buttonMinWidth="150px"
            />
          </div>
      </main>
    </div>
  );
};

export default ViewOrder;
