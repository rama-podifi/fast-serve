import { FunctionComponent, useMemo, type CSSProperties } from "react";
import { MenuItemDTO } from "../shared/types";

type ItemCardType = {
  menuItem?: Partial<MenuItemDTO> | null;

  /** Style props */
  itemCardItemImageFrameWidth?: CSSProperties["width"];
  itemCardItemImageIconWidth?: CSSProperties["width"];
  itemCardItemImageIconAlignSelf?: CSSProperties["alignSelf"];
  itemCardItemImageIconOverflow?: CSSProperties["overflow"];

  /** Action props */
  onItemCardContainerClick?: () => void;
};

const ItemCard: FunctionComponent<ItemCardType> = ({
  menuItem,
  itemCardItemImageFrameWidth,
  itemCardItemImageIconWidth,
  itemCardItemImageIconAlignSelf,
  itemCardItemImageIconOverflow,
  onItemCardContainerClick,
}) => {
  if (!menuItem) {
    return (
        <div className="error-message">
           <p>Menu item data is missing</p>
        </div>
    );
  }

  const { 
    name = 'Default Name',
    price = 0,
    description = 'default description',
    imageUrl = '/bigmac.png'
  } = menuItem

  const itemCardItemImageFrameStyle: CSSProperties = useMemo(() => {
    return {
      width: itemCardItemImageFrameWidth,
    };
  }, [itemCardItemImageFrameWidth]);

  const itemCardItemImageIconStyle: CSSProperties = useMemo(() => {
    return {
      width: itemCardItemImageIconWidth,
      alignSelf: itemCardItemImageIconAlignSelf,
      overflow: itemCardItemImageIconOverflow,
    };
  }, [
    itemCardItemImageIconWidth,
    itemCardItemImageIconAlignSelf,
    itemCardItemImageIconOverflow,
  ]);

  return (
    <div
      className="bg-white shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] box-border w-80 h-[416px] flex flex-col items-center justify-center gap-[10px] text-left text-13xl text-gray-100 font-aleo border-[1px] border-solid border-gainsboro cursor-pointer"
      onClick={onItemCardContainerClick}
    >
      <div
        className="flex flex-col items-start justify-start py-[7px] px-0"
        style={itemCardItemImageFrameStyle}
      >
        <img
          className="relative w-[238px] h-[227px] object-cover"
          alt={name}
          src={imageUrl}
          style={itemCardItemImageIconStyle}
        />
      </div>
      <div className="flex flex-row items-start justify-center">
        <b className="relative capitalize">{name}</b>
      </div>
      <div className="flex flex-row items-start justify-center text-sm">
        <b className="relative text-gray-500 text-center">{description}</b>
      </div>
      <div className="flex flex-row items-start justify-center text-5xl">
        <b className="relative">{`$${price.toFixed(2)}`}</b>
      </div>
    </div>
  );
};

export default ItemCard;
