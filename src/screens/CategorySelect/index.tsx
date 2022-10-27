import React from "react";
import {Container, Header, Title, Category, Icon, Name, Separator, Footer} from "./styles";
import {FlatList} from "react-native";
import {categories} from "../../utils/categories";
import {Button} from "../../components/Forms/Button";

interface CategoryType {
    key: string;
    name: string;
}

interface Props {
    category: CategoryType;
    setCategory: (category: CategoryType) => void;
    closeSelectCategory: () => void;
}

export function CategorySelect({category, setCategory, closeSelectCategory}: Props) {

    function handleCategorySelect(category: CategoryType){
        setCategory(category);
    }
    return (
        <Container>
            <Header>
                <Title>Categoria</Title>
            </Header>
            <FlatList
                data={categories}
                keyExtractor={(item) => item.key}
                renderItem={({item}) => (
                    <Category
                        onPress={() => handleCategorySelect(item)}
                        isActive={category.key === item.key}
                    >
                        <Icon name={item.icon}/>
                        <Name>{item.name}</Name>
                    </Category>
                )
                }
                ItemSeparatorComponent={() => <Separator/>}
            />
            <Footer>
                <Button
                    title={"Selecionar"}
                    onPress={closeSelectCategory}
                />
            </Footer>
        </Container>
    );
}
