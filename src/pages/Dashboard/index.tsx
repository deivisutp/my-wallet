import React, { useState, useMemo, useCallback } from 'react';

import ContentHeader from '../../Components/ContentHeader';
import SelectInput from '../../Components/SelectInput';
import WalletBox from '../../Components/WalletBox';
import MessageBox from '../../Components/MessageBox';
import PieChartComponent from '../../Components/PieChart';
import HistoryBox from '../../Components/HistoryBox';
import BarChartBox from '../../Components/BarChartBox';

import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import listMonths from '../../utils/months';

import happyImg from '../../assets/happy.svg';
import sadImg from '../../assets/sad.svg';
import grinningImg from '../../assets/grinning.svg';

import {
    Container,
    Content,
} from './styles';


const Dashboard: React.FC = () => {
    const [monthSelected, setMonthSelected] = useState<number>(new Date().getMonth() + 1);
    const [yearSelected, setYearSelected] = useState<number>(new Date().getFullYear());

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

        [...expenses, ...gains].forEach(item => {
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
    }, []);

    const totalExpenses = useMemo(() => {
        let total: number = 0;

        expenses.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount);
                } catch (error) {
                    throw new Error('Invalid amount ' + error);
                }
            }
        });

        return total;
    }, [monthSelected, yearSelected]);

    const totalGains = useMemo(() => {
        let total: number = 0;

        gains.forEach(item => {
            const date = new Date(item.date);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (month === monthSelected && year === yearSelected) {
                try {
                    total += Number(item.amount);
                } catch (error) {
                    throw new Error('Invalid amount ' + error);
                }
            }
        });

        return total;
    }, [monthSelected, yearSelected]);

    const totalBalance = useMemo(() => {
        return totalGains - totalExpenses;
    }, [totalGains, totalExpenses]);

    const message = useMemo(() => {
        if (totalBalance < 0) return {
            title: "Ques triste!",
            description: "Neste mês, você gastou mais do que deveria.",
            footerText: "Verifique seus gastos e tente cortar algumas despesas.",
            icon: sadImg
        }

        if (totalGains === 0 && totalExpenses === 0) return {
            title: "Ops!",
            description: "Neste mês, não há registros de entradas ou saídas",
            footerText: "Parece que não foi feito nenhum lançamento.",
            icon: grinningImg
        }

        if (totalBalance === 0) return {
            title: "Uffa!",
            description: "Neste mês, você gastou exatamente o que ganhou.",
            footerText: "Tenha cuidado, no próximo mês tente poupar um pouco.",
            icon: grinningImg
        }

        return {
            title: "Muito Bem!",
            description: "Sua carteira está positiva.",
            footerText: "Continue assim. Considere investir esse valor.",
            icon: happyImg
        }
    }, [totalBalance]);

    const relationBetweenExpensesGains = useMemo(() => {
        const total = totalGains + totalExpenses;

        const gainsPercent = total > 0 ? ((totalGains / total) * 100) : 0;
        const expensesPercent = total > 0 ? ((totalExpenses / total) * 100) : 0;

        return [
            {
                name: "Entradas",
                value: totalGains,
                percent: Number(gainsPercent.toFixed(1)),
                color: '#F7931B'
            },
            {
                name: "Saídas",
                value: totalExpenses,
                percent: Number(expensesPercent.toFixed(1)),
                color: '#E44C4E'
            }
        ];
    }, [totalGains, totalExpenses]);

    const historyData = useMemo(() => {
        return listMonths.map((_, month) => {
            let amountEntry = 0;
            gains.forEach(gain => {
                const date = new Date(gain.date);
                const gainMonth = date.getMonth();
                const gainYear = date.getFullYear();

                if (gainMonth === month && gainYear === yearSelected) {
                    try {
                        amountEntry += Number(gain.amount);
                    } catch {
                        throw new Error('Erro during amount Entry number conversion.');
                    }
                }
            });

            let amountOutput = 0;
            expenses.forEach(expense => {
                const date = new Date(expense.date);
                const expenseMonth = date.getMonth();
                const expenseYear = date.getFullYear();

                if (expenseMonth === month && expenseYear === yearSelected) {
                    try {
                        amountOutput += Number(expense.amount);
                    } catch {
                        throw new Error('Erro during amount Output number conversion.');
                    }
                }
            });

            return {
                monthNumber: month,
                month: listMonths[month].substr(0, 3),
                amountEntry,
                amountOutput,
            }
        }).filter(item => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            return ((yearSelected === currentYear && item.monthNumber <= currentMonth) ||
                (yearSelected < currentYear));
        });
    }, [yearSelected]);

    const relationBetweenEventualRecurrrentExp = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        expenses
            .filter((expense) => {
                const date = new Date(expense.date);
                const expenseMonth = date.getMonth() + 1;
                const expenseYear = date.getFullYear();

                return expenseMonth === monthSelected && expenseYear === yearSelected;
            })
            .forEach((expense) => {
                if (expense.frequency === 'recorrente') {
                    return amountRecurrent += Number(expense.amount)
                }
                if (expense.frequency === 'eventual') {
                    return amountEventual += Number(expense.amount)
                }
            });

        const total = amountRecurrent + amountEventual;
        const percentRec = total > 0 ? Number(((amountRecurrent / total) * 100).toFixed(1)) : 0;
        const percentEv = total > 0 ? Number(((amountEventual / total) * 100).toFixed(1)) : 0;
        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: percentRec,
                color: "#4E41F0",
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEv,
                color: "#E44C4E",
            },
        ];
    }, [yearSelected, monthSelected]);

    const relationBetweenEventualRecurrrentGains = useMemo(() => {
        let amountRecurrent = 0;
        let amountEventual = 0;

        gains
            .filter((gain) => {
                const date = new Date(gain.date);
                const gainMonth = date.getMonth() + 1;
                const gainYear = date.getFullYear();

                return gainMonth === monthSelected && gainYear === yearSelected;
            })
            .forEach((gain) => {
                if (gain.frequency === 'recorrente') {
                    return amountRecurrent += Number(gain.amount)
                }
                if (gain.frequency === 'eventual') {
                    return amountEventual += Number(gain.amount)
                }
            });

        const total = amountRecurrent + amountEventual;
        const percentRec = total > 0 ? Number(((amountRecurrent / total) * 100).toFixed(1)) : 0;
        const percentEv = total > 0 ? Number(((amountEventual / total) * 100).toFixed(1)) : 0;
        return [
            {
                name: 'Recorrentes',
                amount: amountRecurrent,
                percent: percentRec,
                color: "#4E41F0",
            },
            {
                name: 'Eventuais',
                amount: amountEventual,
                percent: percentEv,
                color: "#E44C4E",
            },
        ];
    }, [yearSelected, monthSelected]);

    const handleMonthSelected = useCallback((month: string) => {
        try {
            const parseMonth = Number(month);
            setMonthSelected(parseMonth);
        } catch (error) {
            throw new Error('Invalid month value. It is just acceptable 0 - 24.');
        }
    }, []);

    const handleYearSelected = (year: string) => {
        try {
            const parseYear = Number(year);
            setYearSelected(parseYear);
        } catch (error) {
            throw new Error('Invalid year value.');
        }
    }

    return (
        <Container>
            <ContentHeader title="Dashboard" lineColor="#F7931B">
                <SelectInput
                    options={months}
                    onChange={(e) => handleMonthSelected(e.target.value)}
                    defaultValue={monthSelected} />
                <SelectInput
                    options={years}
                    onChange={(e) => handleYearSelected(e.target.value)}
                    defaultValue={yearSelected} />
            </ContentHeader>

            <Content>
                <WalletBox
                    title="saldo"
                    amount={totalBalance}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="dollar"
                    color="#4E41F0"
                />

                <WalletBox
                    title="entradas"
                    amount={totalGains}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="arrowUp"
                    color="#F7931B"
                />

                <WalletBox
                    title="saídas"
                    amount={totalExpenses}
                    footerLabel="atualizado com base nas entradas e saídas"
                    icon="arrowDown"
                    color="#E44C4E"
                />

                <MessageBox
                    title={message.title}
                    description={message.description}
                    footerText={message.footerText}
                    icon={message.icon}
                />

                <PieChartComponent data={relationBetweenExpensesGains} />

                <HistoryBox
                    data={historyData}
                    lineColorAmountEntry="#F7931B"
                    lineColorAmountOutput="#E44C4E"
                />

                <BarChartBox
                    title="Saídas"
                    data={relationBetweenEventualRecurrrentExp} />

                <BarChartBox
                    title="Entradas"
                    data={relationBetweenEventualRecurrrentGains} />


            </Content>
        </Container>
    );
}

export default Dashboard;