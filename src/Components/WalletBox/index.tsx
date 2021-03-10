import React from 'react';
import CountUp from 'react-countup';

import dollarImg from '../../assets/dollar.svg';
import arrowUpImg from '../../assets/arrow-up.svg';
import arrowDownImg from '../../assets/arrow-down.svg';

import { Container } from './styles';

interface IWalletBoxProps {
    title: string;
    amount: number;
    footerLabel: string;
    icon: 'dollar' | 'arrowUp' | 'arrowDown';
    color: string;
}

const WalletBox: React.FC<IWalletBoxProps> = ({
    title,
    amount,
    footerLabel,
    icon,
    color
}) => {
    const returnIcon = (param: string) => {
        if (param === 'dollar') return dollarImg;
        if (param === 'arrowUp') return arrowUpImg;
        if (param === 'arrowDown') return arrowDownImg;
    }

    return (
        <Container color={color}>
            <span>{title}</span>
            <h1>
                <strong>R$ </strong>
                <CountUp
                    end={amount}
                    separator="."
                    decimal=","
                    decimals={2}
                />
            </h1>
            <small>{footerLabel}</small>
            <img src={returnIcon(icon)} alt={title} />
        </Container>

    );
}

export default WalletBox;