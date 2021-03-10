import React, { useMemo, useState, useEffect } from 'react';
import { uuid } from 'uuidv4';

import ContentHeader from '../../Components/ContentHeader';
import SelectInput from '../../Components/SelectInput';
import HistoryFinanceCard from '../../Components/HistoryFinanceCard';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import formmatCurrency from '../../utils/formmatCurrency';
import formmatDate from '../../utils/formmatDate';
import listMonths from '../../utils/months';

import { Container, Content, Filters } from './styles';

interface IRouteParams {
    match: {
        params: {
            type: string;
        }
    }
}

interface IData {
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;
}

const List: React.FC<IRouteParams> = ({ match }) => {
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());
    const [selectedFrequency, setSelectedFrequency] = useState(['recorrente', 'eventual']);
    const { type } = match.params;

    //Dispara para guardar valores que vem como parametro e quando foi alterado
    const title = useMemo(() => {
        return type === 'entry-balance' ? {
            title: 'Entradas',
            lineColor: '#4E41F0'
        } : {
                title: 'Saídas',
                lineColor: '#E44C4E'
            };
    }, [type]);

    const listData = useMemo(() => {
        return type === 'entry-balance' ? gains : expenses;
    }, [type]);

    const months = useMemo(() => {
        return listMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
    }, []);

    const years = useMemo(() => {
        let uniqueYears: number[] = [];

        listData.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();

            if (!uniqueYears.includes(year)) uniqueYears.push(year);
        });

        return uniqueYears.map(item => {
            return {
                value: item,
                label: item,
            }
        });
    }, [listData]);

    const handleFrequencyClick = (frequency: string) => {
        const alreadySelected = selectedFrequency.findIndex(item => item === frequency);

        if (alreadySelected >= 0) {
            const filtered = selectedFrequency.filter(item => item !== frequency);
            setSelectedFrequency(filtered);
        } else {
            setSelectedFrequency((prev) => [...prev, frequency]);
        }
    }

    const handleMonthSelected = (month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } catch (error) {
            throw new Error('Invalid month value. It is just acceptable 0 - 24.');
        }
    }

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        } catch (error) {
            throw new Error('Invalid year value.');
        }
    }

    useEffect(() => {
        setYearSelected(years[years.length - 1].value);
    }, [years]);

    //Disparado quando a tela é carregada
    useEffect(() => {
        const filteredDate = listData.filter(item => {
            const date = new Date(item.date);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return month === monthSelected && year === yearSelected && selectedFrequency.includes(item.frequency);
        });

        const response = filteredDate.map(item => {
            return {
                id: uuid(),
                description: item.description,
                amountFormatted: formmatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formmatDate(item.date),
                tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E',
            }
        });
        setData(response);
    }, [listData, monthSelected, yearSelected, data.length, selectedFrequency]);

    return (
        <Container>
            <ContentHeader title={title.title} lineColor={title.lineColor}>
                <SelectInput options={months} onChange={(e) => handleMonthSelected(e.target.value)} defaultValue={monthSelected} />
                <SelectInput options={years} onChange={(e) => handleYearSelected(e.target.value)} defaultValue={yearSelected} />
            </ContentHeader>

            <Filters>
                <button
                    type="button"
                    className={`tag-filter tag-filter-recurrent 
                    ${selectedFrequency.includes('recorrente') && 'tag-actived'}`}
                    onClick={() => handleFrequencyClick('recorrente')}
                >
                    Recorrentes
                </button>
                <button
                    type="button"
                    className={`tag-filter tag-filter-eventual
                    ${selectedFrequency.includes('eventual') && 'tag-actived'}`}
                    onClick={() => handleFrequencyClick('eventual')}
                >
                    Eventuais
                </button>
            </Filters>

            <Content>
                {
                    data.map(item => (
                        <HistoryFinanceCard
                            key={item.id}
                            tagColor={item.tagColor}
                            title={item.description}
                            subtitle={item.dateFormatted}
                            amount={item.amountFormatted}
                        />
                    ))
                }
            </Content>
        </Container>
    );
}

export default List;