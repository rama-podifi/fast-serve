import { Dispatch, FunctionComponent, SetStateAction, useCallback, useState } from "react";
import { Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { MenuItemDTO, OrderItemDTO } from "../shared/types";
import { ENotificationType, NotificationMsgType } from "./NotificationMsg";

// Define default values
const DEFAULT_IMAGE_URL = "/path/to/default-image.png";
const DEFAULT_NAME = "No Name Available";
const DEFAULT_PRICE = "Price Not Available";
const DEFAULT_DESCRIPTION = "Description not available.";

type ItemDetailsCardType = {
  menuItem?: Partial<MenuItemDTO>,
  setNotification: Dispatch<SetStateAction<NotificationMsgType | null>>,
};

const ItemDetailsCard: FunctionComponent<ItemDetailsCardType> = ({
  menuItem,
  setNotification
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState<number>(1)

  // Callback to handle button click
  const onButtonContainerClick = useCallback(() => {
    navigate("/homepage");
  }, [navigate]);

  // Validate item details
  const imageUrl = menuItem?.imageUrl || DEFAULT_IMAGE_URL;
  const itemName = menuItem?.name || DEFAULT_NAME;
  const itemPrice = menuItem?.price || DEFAULT_PRICE;
  const itemDescription = menuItem?.description || DEFAULT_DESCRIPTION;

  // Handle rendering of missing data
  const renderMissingDataMessage = (data: string) => (
    <div className="text-red-500">{data}</div>
  );

  const onIncrementButtonClicked = useCallback(() => {
    setQuantity((prevState) => prevState + 1)
  }, [])

  const onDecrementButtonClicked = useCallback(() => {
    if (quantity === 1) return;
    setQuantity((prevState) => prevState - 1)
  }, [quantity])

  const onQuantityInputChange = useCallback((value: any) => {
    if (value === '') {
      setQuantity(0);
      return
    }
    const newQuantity = parseInt(value)
    if (quantity < 0) return;
    setQuantity(newQuantity)
  }, [])

  const onAddToOrderButtonClick = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/api/menu/orders', {
        method: "POST",
        body: JSON.stringify({
          menuItemId: menuItem?.menuItemId,
          quantity
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const orderItem = await response.json() as OrderItemDTO;

      navigate("/homepage", {
        state: {
          notification: {
            type: ENotificationType.ITEM_ADDED,
            notificationIconFrame: '/notificationiconsuccess.png',
            orderItem
          },
        },
      });

    } catch (err) {
      console.error("Error add menu to order:", err);
      setNotification({
        notificationIconFrame: '/notificationiconframe@2x.png',
        notificationBackgroundColor: '#ffeeaa',
        message: `${err}`
      })
    }
  }, [quantity])

  return (
    <div className="bg-white flex flex-row items-start justify-start gap-[41px] text-left text-3xl text-gray-300 font-aleo sm:flex-col sm:gap-[41px] sm:items-center sm:justify-start">
      <img
        className="relative w-[238px] h-[227px] object-cover sm:flex"
        alt={itemName}
        src={imageUrl}
      />
      <div className="self-stretch flex flex-col items-start justify-start gap-[10px] sm:items-start sm:justify-start">
        <div className="flex-1 flex flex-row items-center justify-start gap-[50px] sm:flex-col">
          <div className="flex flex-col items-start justify-start gap-[5px] md:flex-col md:gap-[15px] md:pb-0 md:box-border sm:flex-col sm:items-center sm:justify-start">
            <div className="flex flex-row items-start justify-start md:h-auto md:flex-row sm:flex-col">
              <b className="relative capitalize">{itemName}</b>
            </div>
            <div className="flex flex-col items-start justify-start text-base md:flex-row">
              <b className="relative">{`$${itemPrice}`}</b>
            </div>
          </div>
          <div className="w-[539px] flex flex-row items-start justify-start text-base sm:w-auto sm:[align-self:unset]">
            <div className="flex-1 relative sm:flex">
              {itemDescription}
            </div>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-center justify-end gap-[50px] sm:flex-col sm:gap-[20px] sm:items-end sm:justify-start">
          <div className="flex flex-row items-center justify-start gap-[10px]">
            <img
              className="relative rounded-10xs w-[23px] h-[23px] object-cover"
              alt="Increment Quantity"
              src="/itemdetailscardincrementquantityframe@2x.png"
              onClick={onIncrementButtonClicked}
            />
            <Input
              className="bg-[transparent] font-aleo font-bold text-base text-gray-100"
              placeholder="1"
              size="sm"
              value={quantity}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                onQuantityInputChange(e.currentTarget.value)
              }}
              type="number"
            />
            <img
              className="relative rounded-10xs w-[23px] h-[23px] object-cover"
              alt="Decrement Quantity"
              src="/itemdetailscarddecrementquantityframe@2x.png"
              onClick={onDecrementButtonClicked}
            />
          </div>
          <Button
            buttonText="Add To Order"
            onButtonContainerClick={onAddToOrderButtonClick}
            buttonMinWidth="unset"
          />
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsCard;
