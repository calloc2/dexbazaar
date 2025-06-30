from web3 import Web3
from django.conf import settings

class Blockchain:
    def __init__(self):
        self.web3 = Web3(Web3.HTTPProvider(settings.BLOCKCHAIN_PROVIDER_URL))
        if not self.web3.is_connected():
            raise Exception("Failed to connect to the Ethereum blockchain.")

    def get_balance(self, address):
        """Get the Ether balance of an address."""
        try:
            balance = self.web3.eth.get_balance(address)
            return Web3.from_wei(balance, 'ether') 
        except Exception as e:
            raise Exception(f"Error fetching balance: {str(e)}")

    def send_transaction(self, private_key, to_address, amount):
        """Send Ether from one address to another."""
        try:
            account = self.web3.eth.account.from_key(private_key)
            nonce = self.web3.eth.getTransactionCount(account.address)
            tx = {
                'nonce': nonce,
                'to': to_address,
                'value': self.web3.toWei(amount, 'ether'),
                'gas': 21000,
                'gasPrice': self.web3.toWei('50', 'gwei'),
            }
            signed_tx = self.web3.eth.account.sign_transaction(tx, private_key)
            tx_hash = self.web3.eth.sendRawTransaction(signed_tx.rawTransaction)
            return self.web3.toHex(tx_hash)
        except Exception as e:
            raise Exception(f"Error sending transaction: {str(e)}")