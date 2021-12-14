import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { onAuthStateChanged, getAuth } from "firebase/auth";
import globalStyles from './GlobalStyles';
import CardReviews from "../components/CardReviews";
const auth = getAuth();

export default function ListReviews({ navigation, reviews }) {
    const empresaDetail = useSelector((state) => state.empresaDetail)
    const [userLogged, setUserLogged] = useState(false)
    onAuthStateChanged(auth, (usuarioFirebase) => {
        if (usuarioFirebase) {
            setUserLogged(true)
        }
        else {
            setUserLogged(false)
        }
    })
    return (
        <View>
            <Text style={globalStyles.texts}>
                Reseñas:
            </Text>
            {reviews?.length > 0 ? (
                <ScrollView style={styles.showMenu}>
                    {
                        reviews.map(review => <CardReviews reseña={review} key={review.createAt}></CardReviews>)
                    }
                </ScrollView>) : <Text style={globalStyles.texts}> Este negocio aun no tiene comentarios</Text>}
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
    },
    btnAddReview: {
    },
    btnTitleAddReview: {
    },
    mustLoginText: {
    },
    showMenu: {
        height: 200,
        padding: 5,
        borderWidth: 0,
    },
}) 