import React from 'react'
import {StyleSheet, Text} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { purple, white } from '../utils/colors'


export default function TextButton({children,onPress,style={}}){

    return(
        <TouchableOpacity 
        style={{backgroundColor:purple,borderRadius:5,margin:10}} onPress={onPress}>
            <Text style={[styles.reset,style]}>{children}</Text>
        </TouchableOpacity>
    )
}

const styles=StyleSheet.create({
    reset:{textAlign:'center',
    color:white,
    fontSize:20,
    padding:8,
    paddingLeft:30,
    paddingRight:30,
},
})