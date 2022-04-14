import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import web3 from './connection/web3';
import Web3Context from './store/web3-context';
import CollectionContext from './store/collection-context';
import MarketplaceContext from './store/marketplace-context';
import NFTCollection from './contracts/NFTCollection.json';
import NFTMarketplace from './contracts/NFTMarketplace.json';
import LittleGhostsNFT from './contracts/LittleGhostsNFT.json';
import GhostMarket from './contracts/GhostMarket.json';

// COMPONENTS
import Header from './components/general/Header';
import Footer from './components/general/Footer';
import ScrollTopButton from './components/general/ScrollTopButton';
import NotFound from './components/general/NotFound';

// PAGES
import Home from './components/Home';
import CreateItem from './components/CreateItem';
import Explore from './components/Explore';
import MyAssets from './components/MyAssets';
import NoMetaMaskAlert from './components/general/NoMetaMaskAlert';
import NoContractAlert from './components/general/NoContractAlert';
import ScrollToTop from './components/general/ScrollToTop';

// Main Style
import './App.css';
import Search from './components/Search';
import ItemSingle from './components/ItemSingle';
import Category from './components/Category';


function App() {
    const [noMetaMask, setNoMetaMask] = useState(false);
    const [noContract, setNoContract] = useState(false);
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);
    const [networkType, setNetworkType] = useState(null);
    const { addToast } = useToasts();

    useEffect(() => {
        // Check if the user has Metamask active
        if (!web3) {
            setNoMetaMask(true);
            document.body.style.overflow = 'hidden';
            return;
        }

        // Function to fetch all the blockchain data
        const loadBlockchainData = async () => {
            // Request accounts acccess if needed
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
            } catch (error) {
                console.error(error);
            }

            // Load account
            const account = await web3Ctx.loadAccount(web3);

            // Load Network ID
            const networkId = await web3Ctx.loadNetworkId(web3);

            // Load Contracts
            const nftDeployedNetwork = LittleGhostsNFT.networks[networkId];
            const nftContract = collectionCtx.loadContract(web3, LittleGhostsNFT, nftDeployedNetwork);

            const mktDeployedNetwork = GhostMarket.networks[networkId];
            const mktContract = marketplaceCtx.loadContract(web3, GhostMarket, mktDeployedNetwork);

            console.log("nftContract address: ", nftContract);
            console.log("markteplace address: ", mktContract);

            if (nftContract) {
                // Load total Supply
                const totalSupply = await collectionCtx.loadTotalSupply(nftContract);

                // Load Collection
                collectionCtx.loadCollection(nftContract, totalSupply);

                // Event subscription
                nftContract.events
                    .Transfer()
                    .on('data', (event) => {
                        collectionCtx.updateCollection(nftContract, event.returnValues.tokenId, event.returnValues.to);
                        collectionCtx.setNftIsLoading(false);
                    })
                    .on('error', (error) => {
                        console.log(error);
                    });
            } else {
                setNoContract(true);
            }

            // if (mktContract) {
            //     // Load offer count
            //     const offerCount = await marketplaceCtx.loadOfferCount(mktContract);

            //     // Load offers
            //     marketplaceCtx.loadOffers(mktContract, offerCount);

            //     marketplaceCtx.loadSellers(mktContract);

            //     // Load User Funds
            //     account && marketplaceCtx.loadUserFunds(mktContract, account);

            //     // Event OfferFilled subscription
            //     mktContract.events
            //         .OfferFilled()
            //         .on('data', (event) => {
            //             marketplaceCtx.updateOffer(event.returnValues.offerId);
            //             collectionCtx.updateOwner(event.returnValues.id, event.returnValues.newOwner);
            //             marketplaceCtx.setMktIsLoading(false);
            //         })
            //         .on('error', (error) => {
            //             console.log(error);
            //         });

            //     // Event Offer subscription
            //     mktContract.events
            //         .Offer()
            //         .on('data', (event) => {
            //             marketplaceCtx.addOffer(event.returnValues);
            //             marketplaceCtx.setMktIsLoading(false);
            //         })
            //         .on('error', (error) => {
            //             console.log(error);
            //         });

            //     // Event offerCancelled subscription
            //     mktContract.events
            //         .OfferCancelled()
            //         .on('data', (event) => {
            //             marketplaceCtx.updateOffer(event.returnValues.offerId);
            //             collectionCtx.updateOwner(event.returnValues.id, event.returnValues.owner);
            //             marketplaceCtx.setMktIsLoading(false);
            //         })
            //         .on('error', (error) => {
            //             console.log(error);
            //         });
            // } else {
            //     setNoContract(true);
            // }

            collectionCtx.setNftIsLoading(false);
            marketplaceCtx.setMktIsLoading(false);

            // Metamask Event Subscription - Account changed
            window.ethereum.on('accountsChanged', (accounts) => {
                web3Ctx.loadAccount(web3);
                accounts[0] && marketplaceCtx.loadUserFunds(mktContract, accounts[0]);
                addToast('Account Changed!', {
                    appearance: 'success',
                });
            });

            // Metamask Event Subscription - Network changed
            window.ethereum.on('chainChanged', (chainId) => {
                window.location.reload();
            });

            await web3.eth.net
                .getNetworkType()
                .then((res) => setNetworkType(res))
                .catch((err) => console.log(err));
        };

        loadBlockchainData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <BrowserRouter>
                {noMetaMask && <NoMetaMaskAlert />}
                {!noContract && <Header />}
                {noContract ? <NoContractAlert network={networkType} /> : null}
                <ScrollToTop>
                    <Switch>
                        <Route path='/' exact>
                            <Home />
                            <ScrollTopButton />
                        </Route>
                        <Route path='/mint'>
                            <CreateItem />
                        </Route>
                        <Route path='/explore'>
                            <Explore />
                        </Route>
                        <Route path='/assets/:id'>
                            <ItemSingle />
                        </Route>
                        <Route path='/categories/:category'>
                            <Category />
                        </Route>
                        <Route path='/my-assets'>
                            <MyAssets />
                        </Route>
                        <Route path='/search'>
                            <Search />
                        </Route>
                        <Route>
                            <NotFound />
                        </Route>
                    </Switch>
                </ScrollToTop>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
