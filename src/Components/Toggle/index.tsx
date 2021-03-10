import React from 'react';

import { Container, ToggleLable, ToggleSelector } from './styles';

interface IToggleProps {
    lableLeft: string;
    labelRight: string;
    checked: boolean;
    onChange(): void;
}
const Toggle: React.FC<IToggleProps> = ({
    lableLeft,
    labelRight,
    checked,
    onChange,
}) => (
    <Container>
        <ToggleLable>{lableLeft}</ToggleLable>
        <ToggleSelector
            checked={checked}
            uncheckedIcon={false}
            checkedIcon={false}
            onChange={onChange}
        />
        <ToggleLable>{labelRight}</ToggleLable>
    </Container>
);

export default Toggle;