import React from "react";
import { color, motion } from "framer-motion";
import {
  Box,
  Card,
  CardFooter,
  Button,
  Stack as GStack,
  CardBody,
  Text,
  Heading,
  Tag as GTag,
} from "grommet";
import { Pause, PauseFill, Resume, Trash } from "grommet-icons";
import {
  ButtonGroup,
  Divider,
  Navbar,
  Stack,
  Button as RButton,
  List,
  FlexboxGrid,
  Tag,
  Input,
  Tooltip,
  Whisper,
} from "rsuite";
import { uid } from "react-uid";
import productIcon from "../../../../public/default_images/bascket.png";
import itemSeed from "../../seeds/itemSeed";
import { FaMinusIcon, FaPlusIcon } from "smarthr-ui";
import { toast } from "react-toastify";

const CartItem = ({ item, updateCartItemFunc, gridViewV, onClickFunc }) => {
  const [quantity, setQuantity] = React.useState(item.quantity);
  const [totalItemSum, setTotalItemSum] = React.useState(0);
  React.useEffect(() => {
    setTotalItemSum(
      +item.item.price_amount * item.quantity + item.quantity * +item.item.tax,
    );
    setQuantity(item.quantity);
  }, [item.quantity, item.price_amount]);
  const styleCenter = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "60px",
  };

  const updateCarts = ({ newQty }) => {
    item.quantity = newQty;
    updateCartItemFunc(item);
  };
  const handleReduceItem = () => {
    // handle if item can go below available stock
    if (item.item.min_order_qty <= quantity - 1) {
      if (
        (item.item.available_stock_quantity <= 1 &&
          item.item.allow_negative_stock === true) ||
        item.item.available_stock_quantity >= quantity - 1
      ) {
        setQuantity(quantity - 1);
        return updateCarts({ newQty: quantity - 1 });
      } else {
        toast.info("Item stock not enough");
      }
    } else {
      toast.info("Quantity less than required Item minimun quantity");
    }
  };
  const handleTopItem = ({ value = null }) => {
    // handle if item can exceed availabel  stock
    if (value !== null && value !== undefined) {
      if (isNaN(value)) {
        return setQuantity("");
      }
      if (value.trim().length <= 0) {
        return setQuantity("");
      }
      value = value.trim();
      if (
        +value >= item.item.min_order_qty &&
        +value <= item.item.available_stock_quantity
      ) {
        setQuantity(+value);
        return updateCarts({ newQty: +value });
      } else {
        toast.info(
          "Qty lower than minimum stock Qty or Qty more than available Stock Qty",
        );
      }
    } else {
      if (
        +quantity + 1 >= item.item.min_order_qty &&
        +quantity + 1 <= item.item.available_stock_quantity
      ) {
        setQuantity(+quantity + 1);
        return updateCarts({ newQty: +quantity + 1 });
      } else {
        toast.info(
          "Qty lower than minimum stock Qty or Qty more than available Stock Qty",
        );
      }
    }
  };
  return gridViewV ? (
    <Whisper
      trigger="hover"
      placement="top"
      speaker={
        <Tooltip>
          {" "}
          Total :{item.item.price_currency}
          {totalItemSum}
        </Tooltip>
      }
    >
      <Stack direction="column">
        <Box
          onClick={onClickFunc}
          style={{
            fontWeight: "bolder",
            fontSize: "17px",
            lineHeight: 1.5,
            maxWidth: "70px",
            maxHeight: "20px",
            height: "20px",
            textOverflow: "ellipsis",
            overflowY: "hidden",
          }}
        >
          <Text>{item.item.name}</Text>
        </Box>
        <Box
          justify="center"
          onClick={onClickFunc}
          alignSelf="center"
          align="center"
          alignContent="center"
        >
          <img
            width={"70%"}
            // height={"80%"}
            src={item.item.image ? item.item.image : productIcon}
          ></img>
        </Box>
      
        <Box
              title="Item Tax"
              style={{ marginTop: item.percDiscount > 0 ? "0px" : "15px" }}
            >
              <Text
                style={{
                  fontSize: "17px",
                  lineHeight: 1.5,
                  maxWidth: "100px",
                  height: "20px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
                > 
                {item.percDiscount <= 0 ? <>{item.item.price_currency} {( 
                  +item.item.price_amount * item.quantity +
                  item.quantity * +item.item.tax)}</>
                 : (
                  <small style={{ color: "grey" }}>
                    <strike>{item.item.price_currency}
                      {+item.item.price_amount * item.quantity +
                        item.quantity * +item.item.tax}
                    </strike>
                  </small>
                )}
              </Text>
            </Box>

            <Box title="Item Tax" style={{ marginTop: "5px" }}>
              <Text
                style={{fontSize: "17px",
                  lineHeight: 1.5,
                  maxWidth: "100px",
                  height: "20px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              > 
                {item.percDiscount > 0 ? (
                  <>{item.item.price_currency}
                    {+item.item.price_amount * +item.quantity +
                      +(+item.quantity * +item.item.tax) -
                      (+item.percDiscount / 100) *
                        (+item.item.price_amount * +item.quantity +
                          +(item.quantity * +item.item.tax))}
                  </>
                ) : (
                  ""
                )}
              </Text>
            </Box>
        <Box title="Item Name">
          <Input
            style={{
              margin: "5px",
              // background: "inherit",
              width: "70px",
              height: "30px",
              textAlign: "center",
              fontSize: "20px",
              fontWeight: "bolder",
              outline: "none",
            }}
            onChange={(val) => handleTopItem({ value: val })}
            value={quantity}
          ></Input>
        </Box>
      </Stack>
    </Whisper>
  ) : (
    <List.Item
      key={item.item.name}
      style={{ marginBottom: "10px", position: "relative" }}
    >
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={6} style={{ ...styleCenter }}>
          <>
            <Stack onClick={onClickFunc} direction="column">
              <Box>
                <img
                  width={50}
                  height={50}
                  src={item.item.image ? item.item.image : productIcon}
                ></img>
              </Box>
              <Box title="Item Name">
                <Text
                  style={{
                    fontWeight: "bolder",
                    fontSize: "17px",
                    lineHeight: 1.5,
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    height: "20px",

                    maxWidth: "60px",
                  }}
                >
                  {item.item.name}
                </Text>
              </Box>
            </Stack>
          </>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={6}>
          <Box title="Item Quantity">
            <Stack direction="column">
              <ButtonGroup>
                <RButton
                  startIcon={<FaPlusIcon />}
                  // style={{ background: "inherit" }}
                  title={"add-up qty"}
                  onClick={handleTopItem}
                ></RButton>

                <RButton
                  startIcon={<FaMinusIcon />}
                  title={"reduce qty"}
                  onClick={handleReduceItem}
                ></RButton>
              </ButtonGroup>
              <Input
                style={{
                  margin: "5px",
                  // background: "inherit",
                  width: "85px",
                  height: "30px",
                  textAlign: "center",
                  fontSize: "20px",
                  fontWeight: "bolder",
                  outline: "none",
                }}
                onChange={(val) => handleTopItem({ value: val })}
                value={quantity}
              ></Input>
            </Stack>
          </Box>
        </FlexboxGrid.Item>

        <FlexboxGrid.Item colspan={4}>
          <Stack direction="column">
            <Box title="Item Tax">
              <Tag
                style={{
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  width: "inherit",
                  fontWeight: "bold",
                }}
              >
                Tax
              </Tag>
            </Box>
            <Box title="Item Tax" style={{ marginTop: "15px" }}>
              <Text
                style={{
                  fontWeight: "bolder",
                  fontSize: "17px",
                  lineHeight: 1.5,
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  height: "20px",

                  maxWidth: "60px",
                }}
              >
                {" "}
                {+item.item.tax * +item.quantity}
              </Text>
            </Box>
          </Stack>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={8}>
          <Stack
            direction="column"
            style={{ alignContent: "center", textAlign: "center" }}
          >
            <Box title="Item Tax">
              <Tag
                style={{
                  paddingRight: "10px",
                  paddingLeft: "10px",
                  width: "inherit",
                  fontWeight: "bold",
                  fontSize: "17px",
                }}
                color="orange"
              >
                Total
              </Tag>
            </Box>
            <Box
              title="Item Tax"
              style={{ marginTop: item.percDiscount > 0 ? "0px" : "15px" }}
            >
              <Text
                style={{
                  fontWeight: "bolder",
                  fontSize: "17px",
                  lineHeight: 1.5,
                  maxWidth: "100px",
                  height: "20px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {item.percDiscount <= 0 ? (
                  +item.item.price_amount * item.quantity +
                  item.quantity * +item.item.tax
                ) : (
                  <small style={{ color: "grey" }}>
                    <strike>
                      {+item.item.price_amount * item.quantity +
                        item.quantity * +item.item.tax}
                    </strike>
                  </small>
                )}
              </Text>
            </Box>

            <Box title="Item Tax" style={{ marginTop: "5px" }}>
              <Text
                style={{
                  fontWeight: "bolder",
                  fontSize: "17px",
                  lineHeight: 1.5,
                  maxWidth: "100px",
                  height: "20px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {item.percDiscount > 0 ? (
                  <>
                    {+item.item.price_amount * +item.quantity +
                      +(+item.quantity * +item.item.tax) -
                      (+item.percDiscount / 100) *
                        (+item.item.price_amount * +item.quantity +
                          +(item.quantity * +item.item.tax))}
                  </>
                ) : (
                  ""
                )}
              </Text>
            </Box>
          </Stack>
        </FlexboxGrid.Item>
      </FlexboxGrid>
     
    </List.Item>
  );
};

export default function POSCartItem({
  cart,
  active,
  defaultCurrencV,
  handleUpdateCartFunc,
  gridView,
  setEdit,
  editOn,
  setCurrentEdit,
}) {
  const [held, setHeld] = React.useState(cart.onHold);
  const [cartTotal, setCartTotal] = React.useState(cart.totalPrice);
  const [cartItems, setCartItems] = React.useState(cart.items);

  React.useEffect(() => {
    setHeld(cart.onHold);
    // cart.items = cartItems;
    // handleUpdateCartFunc(cart);
    setCartItems(cart.items);
  }, [cart.onHold, cartItems, editOn]);

  const tertiaryLinks = [
    {
      text: held ? "Resume" : "Hold",
      icon: held ? Resume : Pause,
      onClick: () => holdCart(),
      color: "default",
    },

    { text: "Delete", icon: Trash, color: "red", onClick: () => deleteCart() },
  ];

  const updateCartItem = (item) => {
    const newCartItems = cartItems.map((itm) =>
      itm.id !== item.id ? item : itm,
    );

    setCartItems(newCartItems);
  };

  const deleteCart = () => {};
  const holdCart = () => {
    cart.onHold = !held;
    handleUpdateCartFunc(cart);
    setHeld(!held);
  };

  const TotalSum = () => {
    // convert to default Currency

    var val = 0;
    for (let i = 0; i < cart.items.length; i++) {
      const crtItm = cart.items[i];
      val +=
        +crtItm.item.price_amount * +crtItm.quantity +
        +crtItm.quantity * +crtItm.item.tax;
    }

    return <>{val}</>;
  };

  return (
    <motion.div
      initial={{ x: 50 }}
      animate={{ x: 0, opacity: editOn ? 0.5 : 10 }}
    >
      <Card
        round={"xxsmall"}
        margin={{ vertical: "xsmall" }}
        background={"box"}
        style={{
          overflow: "hidden",
          opacity: held || !active ? 0.5 : 1,
          boxShadow: active
            ? "rgba(99, 159, 99, 0.2) 0px 2px 8px 0px"
            : "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
        }}
        pad={"small"}
      >
        <CardBody
          style={{
            height: held ? "0px" : "auto",
            transition: "all 100ms ease-in",
            overflow: "hidden",
          }}
        >
          {gridView ? (
            <List hover>
              <FlexboxGrid justify="start">
                {cartItems.map((itm, index) => (
                  <FlexboxGrid.Item
                    key={itm.item.name + "-cartitem"}
                    style={{ marginRight: "5px" }}
                    colspan={6}
                  >
                    {" "}
                    <motion.div
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      key={itm.name + "-cartitem"}
                    >
                      <List.Item>
                        <CartItem
                          onClickFunc={() => {
                            setEdit(true);
                            setCurrentEdit(itm);
                          }}
                          updateCartItemFunc={updateCartItem}
                          gridViewV={gridView}
                          item={itm}
                        />
                      </List.Item>{" "}
                    </motion.div>
                  </FlexboxGrid.Item>
                ))}
              </FlexboxGrid>
            </List>
          ) : (
            <List hover>
              {cartItems.map((itm, index) => (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  key={itm.item.name + "-cartitem"}
                >
                  <CartItem
                    onClickFunc={() => {
                      setEdit(true);
                      setCurrentEdit(itm);
                    }}
                    updateCartItemFunc={updateCartItem}
                    gridViewV={gridView}
                    item={itm}
                  />
                </motion.div>
              ))}
            </List>
          )}
        </CardBody>
        <Divider style={{ margin: "5px", padding: "0px" }} />
        <Box
          justify="end"
          alignSelf="end"
          style={{ marginRight: "10px" }}
          direction="row"
        >
          <GTag
            size="xsmall"
            name={<b>Total</b>}
            style={{ borderRadius: "4px" }}
            value={
              <Heading
                style={{ padding: "5px" }}
                size="xxsmall"
                as={"h4"}
                color={"default"}
              >
                {defaultCurrencV} <TotalSum />
              </Heading>
            }
          ></GTag>
        </Box>
        <Divider style={{ margin: "5px", padding: "0px" }} />
        <CardFooter style={{ margin: "0 auto" }} pad={"xxsmall"}>
          <Stack direction="row" spacing={10}>
            {tertiaryLinks.map((lnk, index) => (
              <Button
                key={uid(lnk)}
                size="xsmall"
                label={lnk.text}
                color={"default"}
                primary
                icon={<lnk.icon></lnk.icon>}
                title={lnk.text}
                onClick={lnk.onClick}
              ></Button>
            ))}
          </Stack>
        </CardFooter>
      </Card>
    </motion.div>
  );
}