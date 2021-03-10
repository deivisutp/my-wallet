import React, { useMemo, useState } from 'react';

import emojis from '../../utils/emojis';

import { useTheme } from '../../hooks/theme';
import { Container, Profile, Welcome, UserName, Toggle } from './styles';

const MainHeader: React.FC = () => {
    const { toggleTheme, theme } = useTheme();

    const [darkTheme, setDarkTheme] = useState(() => theme.title === 'dark' ? true : false);

    const handleChangeTheme = () => {
        setDarkTheme(!darkTheme);
        toggleTheme();
    }

    const emoji = useMemo(() => {
        const indice = Math.floor(Math.random() * emojis.length);
        return emojis[indice];
    }, []);

    return (
        <Container>
            <Toggle
                lableLeft="Light"
                labelRight="Dark"
                checked={darkTheme}
                onChange={handleChangeTheme}
            />

            <Profile>
                <Welcome>Olá, {emoji} </Welcome>
                <UserName>Deivis Utpadel</UserName>
            </Profile>
        </Container>

    );
}

export default MainHeader;