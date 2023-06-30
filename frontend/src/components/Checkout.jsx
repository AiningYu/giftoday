import React, { useEffect } from "react";
import { useState } from "react";
import PostalAddress from "../components/PostalAddress";
import PaymentDetail from "../components/PaymentDetail";
import OrderSummary from "../components/OrderSummary";
import { getUserID } from "../states/GlobalState";
function Checkout() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [id] = useState(getUserID);
  const [isPremium, setPremium] = useState(false);
  const [carts, setCarts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Fetch user information from the backend

    fetch(`http://localhost:4000/user/${id}/finalcart`)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const carts = data;
          setCarts(carts);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching user info:", error);

        setLoading(false);
      });
  }, [id]);

  const deleteAllCartItems = async () => {
    try {
      const response = await fetch(`http://localhost:4000/user/${id}/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // Clear the carts state
        setCarts([]);
      } else {
        console.log("Deleting data failed.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPremium = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/user/" + id + "/premium",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setPremium(responseData);
        } else {
          console.log("Fetching data failed.");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPremium();
  }, [id, isPremium]);

  useEffect(() => {
    document.title = "Giftoday - Checkout";
  }, []);
  const handleSelectCard = (card) => {
    setSelectedCard(card);
  };
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };
  const handleSubmit = async () => {
    if (!carts || carts.length === 0) {
      setErrorMessage("You don't have any order😣");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
      return;
    }
    if (!selectedCard) {
      setErrorMessage("Please select a card 💳");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
      return;
    }
    if (!selectedAddress) {
      setErrorMessage("Please select a address📍");
      setTimeout(() => {
        setErrorMessage("");
      }, 1000);
      return;
    }
    try {
      let calculatedTotalPrice = totalPrice;

      if (isPremium) {
        calculatedTotalPrice *= 0.9;
      }
      calculatedTotalPrice = Number(calculatedTotalPrice.toFixed(2));
      const orderData = {
        total: calculatedTotalPrice,
        address: selectedAddress,
        card: selectedCard,
        gift: carts,
      };

      const response = await fetch(`http://localhost:4000/user/${id}/order`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        await deleteAllCartItems();
        window.location.href = "/giftoday.com/OrderConfirmation";
      } else {
        console.error("Failed to submit order");
      }
    } catch (error) {
      console.error("An error occurred while submitting the order", error);
    }
  };
  return (
    <div className="mx-64">
      <div className="flex-col-2 flex w-[500px]">
        {/* Order Summary */}
        <div className="pt-24">
          <OrderSummary
            onTotalPriceChange={(totalPrice) => {
              setTotalPrice(totalPrice);
            }}
          />
        </div>

        {/* Payment Detail */}
        <div className="pl-12 pt-24">
          <PaymentDetail onSelectCard={handleSelectCard} />
        </div>
      </div>

      {/* Shipping Address */}
      <div className=" row-span-2 flex flex-row pt-4">
        <PostalAddress onSelectAddress={handleSelectAddress} />
      </div>

      {/* Check out button */}
      <div
        className="fixed bottom-4 right-4 rounded-lg bg-gray-100 p-4"
        style={{ zIndex: 9999 }}
      >
        {!isPremium && (
          <span className="basis-5/6 font-bold text-lightFontColor">
            Total Price: € {totalPrice}
          </span>
        )}
        {isPremium && (
          <div className="basis-5/6 font-bold text-lightFontColor ">
            <span className="line-through">€ {totalPrice}</span>
            <span className=" ml-4 basis-5/6 text-xl font-bold text-orangeFontColor ">
              {/* toFixed Retain two decimal places */}
              Total Price: €{(totalPrice * 0.9).toFixed(2)}
            </span>
          </div>
        )}
        <button
          className="mt-4 rounded bg-orangeFontColor px-4 py-2 font-bold text-white"
          onClick={handleSubmit}
        >
          Check out
        </button>
      </div>
      {errorMessage && (
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-md bg-red-500 px-4 py-2 text-white">
          {errorMessage}
        </div>
      )}
    </div>
  );
}

export default Checkout;