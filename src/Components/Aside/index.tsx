import React, { useState } from 'react';

import {
    MdDashboard,
    MdArrowDownward,
    MdArrowUpward,
    MdExitToApp,
    MdClose,
    MdMenu
} from 'react-icons/md';
import Toggle from '../Toggle';

import logoImg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';
import { useTheme } from '../../hooks/theme';

import {
    Container,
    Header,
    LogoImg,
    Title,
    MenuContainer,
    MenuItemLink,
    MenuItemButton,
    ToggleMenu,
    ThemeToggleFooter
} from './styles';

const Aside: React.FC = () => {
    const { signOut } = useAuth();
    const { toggleTheme, theme } = useTheme();

    const [toggleMenuIsOpened, setToggleMenuIsOpened] = useState(false);
    const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

    const handleChangeTheme = () => {
        setDarkTheme(!darkTheme);
        toggleTheme();
    }

    const handleToggleMenu = () => {
        setToggleMenuIsOpened(!toggleMenuIsOpened);
    }

    return (
        <Container menuIsOpen={toggleMenuIsOpened}>
            <Header>
                <ToggleMenu onClick={handleToggleMenu} >
                    {toggleMenuIsOpened ? <MdClose /> : <MdMenu />}
                </ToggleMenu>

                <LogoImg src={logoImg} alt="Logo Minha Carteira" />
                <Title>Minha carteira</Title>
            </Header>

            <MenuContainer>
                <MenuItemLink href="/">
                    <MdDashboard />
                        Dashboard
                    </MenuItemLink>

                <MenuItemLink href="/list/entry-balance">
                    <MdArrowUpward />
                        Entradas
                    </MenuItemLink>

                <MenuItemLink href="/list/exit-balance">
                    <MdArrowDownward />
                        Saídas
                    </MenuItemLink>

                <MenuItemButton onClick={signOut}>
                    <MdExitToApp />
                        Sair
                </MenuItemButton>
            </MenuContainer>

            <ThemeToggleFooter menuIsOpen={toggleMenuIsOpened} >
                <Toggle
                    lableLeft="Light"
                    labelRight="Dark"
                    checked={darkTheme}
                    onChange={handleChangeTheme}
                />
            </ThemeToggleFooter>
        </Container>

    );

}

export default Aside;