import React from "react";
import {
    Container,
    Header,
    HightLightCards,
    LogoutButton,
    Icon,
    Photo,
    Title,
    TransactionList,
    Transactions,
    User,
    UserGreeting,
    UserInfo,
    UserName,
    UserWrapper,
} from "./styles";
import {HightLightCard} from "../../components/HightLightCard";
import {TransactionCard, TransactionCardProps} from "../../components/TransactionCard";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

export function Dashboard() {

    const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title: "Desenvolvimento de Site",
            amount: "R$ 12.000,00",
            category: {name: "Vendas", icon: "dollar-sign"},
            date: "13/04/2020"
        },
        {
            id: '2',
            type: 'negative',
            title: "Hamburgueria Pizzy",
            amount: "R$ 59,00",
            category: {name: "Alimentacao", icon: "coffee"},
            date: "13/04/2020"
        },
        {
            id: '3',
            type: 'negative',
            title: "Aluguel do Apartamento",
            amount: "R$ 1200,00",
            category: {name: "Casa", icon: "shopping-bag"},
            date: "13/04/2020"
        },
    ];


    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri: 'https://avatars.githubusercontent.com/u/52896732?v=4'}}/>
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>João Neto</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton
                        onPress={() => {}}
                    >
                        <Icon name={'power'}/>
                    </LogoutButton>

                </UserWrapper>
            </Header>
            <HightLightCards>
                <HightLightCard
                    type={'up'}
                    title={"Entrada"}
                    amount={"R$ 17.400,00"}
                    lastTransaction={"Última entrada dia 13 de abril"}
                />
                <HightLightCard
                    type={'down'}
                    title={"Saídas"}
                    amount={"R$ 1.259,00"}
                    lastTransaction={"Última entrada dia 03 de abril"}
                />
                <HightLightCard
                    type={'total'}
                    title={"Total"}
                    amount={"R$ 16.141,00"}
                    lastTransaction={"01 à 16 de abril"}
                />
            </HightLightCards>


            <Transactions>
                <Title>Listagem</Title>

                <TransactionList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => <TransactionCard data={item}/>}

                />

            </Transactions>
        </Container>
    )
}
