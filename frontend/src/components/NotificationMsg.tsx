import { FunctionComponent, useMemo, type CSSProperties } from "react";
import { OrderItemDTO } from "../shared/types";

export type NotificationMsgType = {
  type?: ENotificationType;
  notificationIconFrame?: string;
  orderItem?: Partial<OrderItemDTO>;
  message?: string;
  secondaryMessage?: string;

  /** Style props */
  notificationBackgroundColor?: CSSProperties["backgroundColor"];
  notificationMainMessageFrFlex?: CSSProperties["flex"];
  notificationSecondaryMessFlex?: CSSProperties["flex"];
};

export const enum ENotificationType {
  ITEM_ADDED = 'Item Added',
  ORDER_PLACED = 'Order Placed',
  NO_MENU = 'No Menu',
  DEFAULT = ''
}

const NotificationMsg: FunctionComponent<NotificationMsgType> = ({
  type = ENotificationType.DEFAULT,
  message,
  secondaryMessage,
  orderItem,
  notificationBackgroundColor,
  notificationIconFrame,
  notificationMainMessageFrFlex,
  notificationSecondaryMessFlex,
}) => {
  const notificationStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: notificationBackgroundColor,
    };
  }, [notificationBackgroundColor]);

  const notificationMainMessageFrameStyle: CSSProperties = useMemo(() => {
    return {
      flex: notificationMainMessageFrFlex,
    };
  }, [notificationMainMessageFrFlex]);

  const notificationSecondaryMessageFrStyle: CSSProperties = useMemo(() => {
    return {
      flex: notificationSecondaryMessFlex,
    };
  }, [notificationSecondaryMessFlex]);

  const notificationMainMessage = useMemo(() => {
    if (type === ENotificationType.ITEM_ADDED) {
      return `Item added to order`
    }

    if (type === ENotificationType.ORDER_PLACED) {
      return 'Order successfully placed'
    }

    if (type === ENotificationType.NO_MENU) {
      return 'Nothing currently listed as available, please refresh menu'
    }

    return message;
  }, [type])

  const notificationSecondaryMessage = useMemo(() => {
    if (type === ENotificationType.ITEM_ADDED && orderItem) {
      return `${orderItem.quantity}x ${orderItem.menuItemName} $${orderItem.itemTotal}`
    }
    return secondaryMessage
    ;
  }, [type])


  return (
    <section
      className="self-stretch rounded-6xl bg-lightgoldenrodyellow flex flex-row items-center justify-start py-[25px] px-7 gap-[34px] text-left text-21xl text-gray-200 font-roboto border-[1px] border-solid border-lightgoldenrodyellow lg:flex-row lg:gap-[20px] lg:items-center lg:justify-start md:self-stretch md:w-auto md:flex-row md:gap-[5px] md:items-center md:justify-start md:pr-7 md:box-border"
      style={notificationStyle}
      role="button"
    >
      <img
        className="relative w-[75px] h-[75px] overflow-hidden shrink-0 object-cover"
        alt=""
        src={notificationIconFrame}
      />
      <div
        className="flex-1 flex flex-row items-center justify-start md:flex-1 md:items-center md:justify-start"
        style={notificationMainMessageFrameStyle}
      >
        <b className="relative">{notificationMainMessage}</b>
      </div>
      <div
        className="flex-1 flex flex-row items-center justify-start text-13xl text-gray-300 font-work-sans md:flex-1 sm:gap-[10px]"
        style={notificationSecondaryMessageFrStyle}
      >
        <p className="relative text-base text-gray-500" >{notificationSecondaryMessage}</p>
      </div>
    </section>
  );
};

export default NotificationMsg;
