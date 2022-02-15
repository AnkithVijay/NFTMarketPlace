import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from 'next/router';
import axios from 'axios';
import Web3Modal from 'web3modal';

import {
    nftaddress, nftmarketaddress
} from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTmarket.sol/NFTMarket.json';


export default function MyAssets() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const [sold, setSold] = useState([]);

    useEffect(() => {
        loadNfts();
    }, []);


    async function loadNfts() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);

        const data = await marketContract.fetchItemsCreated();

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId);
            const meta = await axios.get(tokenUri);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
            }
            return item;
        }))

        const soldItems = items.filter(i => i.sold);

        setNfts(items);
        setSold(soldItems);
        setLoadingState('loaded');
    }


    if (loadingState === 'loaded' && !nfts.length) {
        return <h1 className="py-10 px-20 text-3xl">No Assets Owned</h1>
    }

    return (
        <div>
            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        nfts.map((nft, i) => (
                            <div>
                                <div key={i} className="rounded">
                                    <img src={nft.image} className="rounded" />
                                    <div className="p-4 bg-black">
                                        <p className="text-2xl font-bold text-white">
                                            Price - {nft.price} ETH
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    {
                        Boolean(sold.length) && (
                            <div>
                                <h2 className="text-2xl py-2">
                                    Items Sold
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                                    {
                                        sold.map((nft, i) => (
                                            <div>
                                                <div key={i} className="rounded">
                                                    <img src={nft.image} className="rounded" />
                                                    <div className="p-4 bg-black">
                                                        <p className="text-2xl font-bold text-white">
                                                            Price - {nft.price} ETH
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}