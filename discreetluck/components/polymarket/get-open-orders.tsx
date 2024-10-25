import React, { useEffect, useState } from "react";
import { clobClient } from "./client";
import { Side, OrderType } from "@polymarket/clob-client";

const OrderList: React.FC = () => {
  const [bids, setBids] = useState<any[]>([]);
  const [asks, setAsks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptOrder = async (selectedOrder: any, side: Side) => {
    try {
      const matchingOrder = await clobClient.createOrder({
        tokenID:
          "11015470973684177829729219287262166995141465048508201953575582100565462316088",
        price: selectedOrder.price,
        side: side === Side.BUY ? Side.SELL : Side.BUY, // You are taking the opposite side
        size: selectedOrder.size,
        feeRateBps: 100,
        nonce: Date.now(),
      });

      const response = await clobClient.postOrder(matchingOrder, OrderType.FOK);
      console.log("Order accepted:", response);
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  useEffect(() => {
    const main = async () => {
      try {
        // Fetch the order book from the CLOB API
        const resp = await clobClient.getOrderBook(
          "11015470973684177829729219287262166995141465048508201953575582100565462316088"
        );
        console.log("Order Book Response:", resp);

        // Set the bids and asks in the state
        setBids(resp.bids);
        setAsks(resp.asks);
      } catch (error) {
        console.error("Error fetching order book:", error);
        setError("Failed to fetch order book.");
      }
    };

    main(); // Call main to fetch the order book when component mounts
  }, []);

  return (
    <div>
      <h1>Polymarket Book</h1>
      {error ? (
        <p>{error}</p>
      ) : (
        <div>
          <div>
            <h2>Bids</h2>
            {bids.length > 0 ? (
              bids.map((bid, index) => (
                <div key={index} className="order">
                  <p>
                    <strong>Price:</strong> {bid.price}
                  </p>
                  <p>
                    <strong>Size:</strong> {bid.size}
                  </p>
                  <button
                    onClick={() => handleAcceptOrder(bid, Side.BUY)}
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                  >
                    Accept Bid
                  </button>
                </div>
              ))
            ) : (
              <p>No bids available</p>
            )}
          </div>

          <div>
            <h2>Asks</h2>
            {asks.length > 0 ? (
              asks.map((ask, index) => (
                <div key={index} className="order">
                  <p>
                    <strong>Price:</strong> {ask.price}
                  </p>
                  <p>
                    <strong>Size:</strong> {ask.size}
                  </p>
                  <button
                    onClick={() => handleAcceptOrder(ask, Side.SELL)}
                    className="mt-2 p-2 bg-blue-500 text-white rounded"
                  >
                    Accept Ask
                  </button>
                </div>
              ))
            ) : (
              <p>No asks available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
