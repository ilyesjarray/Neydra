import time
from web3 import Web3

# Constants
ETH_RPC_URL = "https://cloudflare-eth.com"  # Free Ethereum RPC Provider
USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
MY_USDT_WALLET = "0x7Ee22c8C929A65dBA02C810e23fEbE1AF706F476"  # Replace with your wallet address (must be checksummed)

# Subscription Plan Thresholds (USDT, in 6 decimals: 1 USDT = 1,000,000 units)
SUBSCRIPTION_PLANS = {
    "standard": 15 * 10**6,  # 15 USDT
    "premium": 40 * 10**6,   # 40 USDT
    "ultra": 90 * 10**6      # 90 USDT
}

# Initialize Web3.py
web3 = Web3(Web3.HTTPProvider(ETH_RPC_URL))
print("Connected to Ethereum:", web3.isConnected())

# Initialize USDT Contract
usdt_contract = web3.eth.contract(address=USDT_CONTRACT_ADDRESS, abi=[
    {
        "constant": False,
        "inputs": [
            {"name": "from", "type": "address"},
            {"name": "to", "type": "address"},
            {"name": "value", "type": "uint256"},
        ],
        "name": "Transfer",
        "outputs": [],
        "payable": False,
        "type": "event",
    }
])

def process_subscription(subscription_plan, from_address):
    """
    Grant access to the user based on the subscription plan.
    This is where you update your database or unlock a locked page.
    """
    print(f"Granting {subscription_plan} subscription to {from_address}")
    # TODO: Integrate with your database (e.g., SQLite, MySQL) to update the user's subscription plan
    # Example:
    # db.execute("UPDATE users SET subscription_plan = ? WHERE wallet_address = ?", (subscription_plan, from_address))


def listen_to_payments():
    """
    Main function to listen to USDT transactions towards the wallet.
    """
    print(f"Listening for payments to wallet: {MY_USDT_WALLET}...")
    block_filter = web3.eth.filter({"address": USDT_CONTRACT_ADDRESS, "fromBlock": "latest", "topics": []})

    while True:
        try:
            for event in block_filter.get_new_entries():
                event_receipt = web3.eth.getTransactionReceipt(event["transactionHash"])
                logs = usdt_contract.events.Transfer().processReceipt(event_receipt)

                for log in logs:
                    from_address = log.args["from"]
                    to_address = log.args["to"]
                    amount = log.args["value"]

                    # Check if funds were sent to your wallet
                    if to_address.lower() == MY_USDT_WALLET.lower():
                        print(f"Payment received: {amount / 10**6} USDT from {from_address}")

                        # Match payment to subscription plans
                        for plan, threshold in SUBSCRIPTION_PLANS.items():
                            if amount == threshold:
                                process_subscription(plan, from_address)
                                break
        except Exception as e:
            print("Error listening for payments:", e)

        time.sleep(5)  # Listen every 5 seconds


if __name__ == "__main__":
    listen_to_payments()
