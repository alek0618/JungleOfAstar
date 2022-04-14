import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import CollectionContext from '../store/collection-context';
import MarketplaceContext from '../store/marketplace-context';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation } from 'swiper';
import { formatPrice } from '../helpers/utils';
import { categoryOptions } from '../helpers/constants';
import 'swiper/swiper-bundle.css';

// COMPONENTS
import HomeBanner from './home/HomeBanner';
import NftItem from './general/NftItem';
import NoDataAlert from './general/NoDataAlert';
import Loader from './general/Loader';

SwiperCore.use([Navigation]);

function Home({ topSellers }) {
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);

    useEffect(() => {
        document.title = 'Astar | React NFT Marketplace';
    });

    // RETURN ITEMS TEMPLATE
    return (
        <>
            <HomeBanner />

            {/* MARKETPLACE FEATURED ITEMS */}
            <section className='py-5'>
                <div className='container py-5'>
                    <header className='mb-5'>
                        <div className='row'>
                            <div className='col-lg-6'>
                                <h2>Marketplace's Choice</h2>
                            </div>
                        </div>
                    </header>

                    {collectionCtx.totalSupply === 0 && !collectionCtx.nftIsLoading ? (
                        <div className='col-9'>
                            <NoDataAlert
                                heading="There're no NFTs at the moment."
                                subheading='Try to mint some assets to see how are we rendering them.'
                            />
                        </div>
                    ) : null}

                    {collectionCtx.collection.length === 0 && collectionCtx.totalSupply !== 0 ? <Loader /> : null}

                    <Swiper
                        spaceBetween={10}
                        breakpoints={{
                            400: { slidesPerView: 1 },
                            900: { slidesPerView: 2 },
                            1200: { slidesPerView: 3 },
                            1400: { slidesPerView: 4 },
                        }}
                        navigation={Boolean(collectionCtx.collection.length !== 0)}
                    >
                        {collectionCtx.collection
                            .slice(Math.max(collectionCtx.collection.length - 4, 1))
                            .map((NFT, key) => {
                                const index = marketplaceCtx.offers
                                    ? marketplaceCtx.offers.findIndex((offer) => offer.id === NFT.id)
                                    : -1;
                                const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
                                const price =
                                    index !== -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;

                                return (
                                    <SwiperSlide key={key}>
                                        <NftItem {...NFT} index={index} owner={owner} price={price} nftKey={key} />
                                    </SwiperSlide>
                                );
                            })}
                    </Swiper>
                </div>
            </section>

        </>
    );
}

export default Home;
