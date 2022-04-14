import React from 'react';
import { Link } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { particlesOptions } from '../../helpers/constants';

function HomeBanner() {
    return (
        <section className='hero bg-dark py-5'>
            <Particles options={particlesOptions} />
            <div className='container py-5 z-index-20 position-relative mt-5'>
                <div className='row align-items-center mt-5'>
                    <div className='col-lg-5'>
                        <h2>Create, sell and collect digital items.</h2>
                        <p className='text-muted'>Kongz Of Astar Utilities</p>                        
                        <p className='text-muted'>Reflection: 5% MINTING FEES</p>                        
                        <p className='text-muted'>Marketplace: 25% DISTRIBUTED TO HOLDERS</p>                        
                        <p className='text-muted'>Lottery Tax: 6% Distributed to Holders</p>                        
                        <p className='text-muted'>TOTAL REWARDS:</p>
                        <ul className='list-inline'>
                            <li className='list-inline-item'>
                                <Link className='btn btn-gradient-primary' to='/mint'>
                                    Mint NFT
                                </Link>
                            </li>
                            <li className='list-inline-item'>
                                <Link className='btn btn-light' to='/explore'>
                                    Marketplace
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col-lg-6 ms-auto d-none d-lg-block'>
                        <img className='img-fluid mx-auto' src=' images/bg.gif' alt='..' />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeBanner;
