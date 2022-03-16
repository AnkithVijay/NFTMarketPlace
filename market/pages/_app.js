import '../styles/globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';



function walletConnect() {
  const [active, setActive] = useState(false);
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);


  async function connect() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const address  = await signer.getAddress();
    setActive(true);
    setAccount(address.substring(0,5) + "......" +address.slice(address.length - 4));
    setLoading(false);
  }
  
  useEffect(() => {
    if(loading == true){
      connect();
    }
  }, [loading]);

  return (
    <div className="col-span-4">
      {!loading ? 
        (active ? <button onClick={disconnect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">{account}</button> : <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect to MetaMask</button>)
       : <button className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Loading...</button>}
      {/* {active ? <span>Connected with <b>{account}</b></span> : <span>Not connected</span>} */}
    </div>
  )
}



async function disconnect() {

}

function MyApp({ Component, pageProps }) {


  return (
    <div className="container mx-auto">
      <nav className='border-b p-6'>
        <p className='text-4xl font-bold'>
          Metaverse Market
        </p>
        <div className='flex mt-4'>
          <Link href='/'>
            <a className='mr-6 text-blue-500'>
              Home
            </a>
          </Link>
          <Link href='/create-item'>
            <a className='mr-6 text-blue-500'>
              Sell Assets
            </a>
          </Link>
          <Link href='/my-assets'>
            <a className='mr-6 text-blue-500'>
              My Assets
            </a>
          </Link>
          <Link href='/creator-dashboard'>
            <a className='mr-6 text-blue-500'>
              My Dashboard
            </a>
          </Link>
        </div>
        <div className='flex mt-4'>
          {walletConnect()}
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
