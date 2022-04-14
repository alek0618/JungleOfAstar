import React from 'react';
import { useForm } from '@formspree/react';

function Footer() {
    const [state, handleSubmit] = useForm('xlezgplp');

    return (
        <footer className='footer bg-map bg-dark'>
            <div className='container'>
                <div className='pt-1 bg-body rounded-pill'></div>
            </div>

            <div className='container py-4'>
                <div className='row text-center'>
                    <p className='text-muted text-sm mb-0'>
                        © 2022 All rights reserved. Designed with <i className='las la-xs text-primary la-heart'></i> by{' '}
                        <span className='text-primary'>Kongz Of Astar.</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
