import React, { useState } from "react";
import Alert from "react-native"

export const useLoginButton = ({email, password, navigation}) => {
    if (email !== "" && password !== "")
        navigation.navigate("Jobs")
}