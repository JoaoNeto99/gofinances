import React, {useCallback, useState} from "react";

import {
    ChartContainer,
    Container,
    Content,
    Header,
    LoadContainer,
    Month,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Title
} from './styles';
import {HistoryCard} from "../../components/HistoryCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {categories} from "../../utils/categories";
import {VictoryPie} from "victory-native";
import {ActivityIndicator} from "react-native";
import {RFValue} from "react-native-responsive-fontsize";
import {useTheme} from "styled-components";
import {useBottomTabBarHeight} from "@react-navigation/bottom-tabs";

import {addMonths, format, subMonths} from 'date-fns'
import {ptBR} from "date-fns/locale";
import {useFocusEffect} from "@react-navigation/native";
import {useAuth} from "../../hooks/auth";


interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;

}

export function Resume() {

    const [isLoading, setIsLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
    const theme = useTheme()
    const {user} = useAuth()

    async function loadData() {
        setIsLoading(true)
        const dataKey = `@gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        const expensives = responseFormatted.filter((expensive: TransactionData) =>
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
        );

        const expensivesTotal = expensives.reduce((acumullator: number, expensive: TransactionData) => {
            return acumullator + Number(expensive.amount)
        }, 0)

        const _totalByCategory: CategoryData[] = []

        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if (expensive.category === category.key) {
                    categorySum += Number(expensive.amount);
                }
            })

            if (categorySum > 0) {
                const totalFormatted = categorySum.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

                _totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    total: categorySum,
                    color: category.color,
                    totalFormatted,
                    percent
                });
            }
        })

        console.log(_totalByCategory)
        setTotalByCategories(_totalByCategory)
        setIsLoading(false)
    }

    function handleDateChange(action: 'next' | 'prev') {

        if (action === 'next') {
            setSelectedDate(addMonths(selectedDate, 1))
        }

        if (action === 'prev') {
            setSelectedDate(subMonths(selectedDate, 1))
        }
    }

    useFocusEffect(useCallback (()=> {
        loadData()
    }, [selectedDate]));

    return (
        <Container>
            <Header>
                <Title>Resumo por categoria</Title>
            </Header>
            {
                isLoading ?
                    <LoadContainer>
                        <ActivityIndicator color={theme.colors.primary} size={"large"}/>
                    </LoadContainer>
                    :
                    <Content
                        contentContainerStyle={{paddingHorizontal: 24, paddingBottom: useBottomTabBarHeight()}}
                        showsVerticalScrollIndicator={false}
                    >
                        <MonthSelect>
                            <MonthSelectButton onPress={() => handleDateChange('prev')}>
                                <MonthSelectIcon name={"chevron-left"}/>
                            </MonthSelectButton>

                            <Month>{format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}</Month>

                            <MonthSelectButton onPress={() => handleDateChange('next')}>
                                <MonthSelectIcon name={"chevron-right"}/>
                            </MonthSelectButton>

                        </MonthSelect>

                        <ChartContainer>
                            <VictoryPie
                                data={totalByCategories}
                                colorScale={totalByCategories.map(category => category.color)}
                                style={{
                                    labels: {fontSize: RFValue(18), fontWeight: 'bold', fill: theme.colors.shape},
                                }}
                                labelRadius={50}
                                x={"percent"}
                                y={"total"}
                            />
                        </ChartContainer>

                        {
                            totalByCategories.map(item => (
                                <HistoryCard
                                    key={item.key}
                                    title={item.name}
                                    amount={item.totalFormatted}
                                    color={item.color}
                                />
                            ))
                        }
                    </Content>

            }
        </Container>
    )
}

/*
                 <VictoryPie data={totalByCategories} x={"name"} y={"total"}/>

 <PieChart data={totalByCategories} width={200}
                          height={200} accessor={"total"} backgroundColor={"none"}
                          paddingLeft={15}/>*/
