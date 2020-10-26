import React, { Component } from 'react'
import { View, Text,Platform,StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDailyReminderValue, getMetricMetaInfo, timeToString } from '../utils/helpers'
import {Ionicons} from '@expo/vector-icons'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import UdaciSlider from './UdaciSlider'
import UdaciSteppers from './UdaciSteppers'
import { removeEntry, submitEntry } from '../utils/api'
import {addEntry} from '../actions'
import { purple, white } from '../utils/colors'


function SubmitBtn({onPress}){
    return(
        <TouchableOpacity onPress={onPress} style={Platform.OS==='ios'?styles.iosSubmitBtn:styles.androidSubmitBtn}>
            <Text style={styles.submitBtnText}>SUBMIT</Text>
        </TouchableOpacity>
    )
}


class AddEntry extends Component {

    state = {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }

    increment=(metric)=>{
        const {max,step}=getMetricMetaInfo(metric)
        this.setState((state)=>{
            const count=state[metric]+step
            return{
            ...state,
            [metric]:count>max?max:count
            }
        })
    }

    decrement=(metric)=>{
        const {step}=getMetricMetaInfo(metric)
        this.setState((state)=>{
            const count=state[metric]-step
            return{
            ...state,
            [metric]:count<0?0:count
            }
        })
    }

    slide =(metric,value)=>{
        this.setState(()=>({
            [metric]:value
        }))
    }
    toHome=()=>{
        this.props.navigation.jumpTo('History')
    }

    submit=()=>{
        const {dispatch} =this.props
        const key=timeToString()
        const entry=[this.state]
       
        this.setState(()=>({
            run: 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        }))
        dispatch(addEntry({[key]:entry}))
        submitEntry({entry,key})
        this.toHome()
    }

    reset=()=>{
       const key=timeToString() 
       this.props.dispatch(addEntry({
           [key]:getDailyReminderValue()
       }))
       removeEntry(key)
    }

    render() {

        const metaInfo=getMetricMetaInfo()

        if(this.props.alreadLogged){
            return(
                <View style={styles.center}>
                    <Ionicons 
                    name={Platform.OS==='ios'?'ios-happy':'md-happy'}
                    size={100}
                    />
                    <Text>You already logged your information for today</Text>
                    <TextButton style={{padding:10}} onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
            {Object.keys(metaInfo).map((key) => {
                const {getIcon,type,displayName,...rest} = metaInfo[key]
                const value=this.state[key]
                return(
                    <View key={key} style={styles.row}>
                        <Text>{getIcon()}</Text>
                        {type==='slider'?
                        <UdaciSlider
                         value={value}
                         onChange={(value)=>this.slide(key,value)}
                         {...rest}
                        />:
                        <UdaciSteppers
                        value={value}
                        onIncrement={()=>this.increment(key)}
                        onDecrement={()=>this.decrement(key)}
                        {...rest}
                        />
                        }
                    </View>
                )
              
            })}
            <SubmitBtn onPress={this.submit}></SubmitBtn>
            </View>

        )
    }
}

const styles=StyleSheet.create({
    container:{
     flex:1,
     padding:10,
     backgroundColor:white,
    },
    row:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    center:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    iosSubmitBtn:{
        backgroundColor:purple,
        padding:10,
        borderRadius:7,
        height:45,
        marginLeft:40,
        marginRight:40,
    },
    androidSubmitBtn:{
        padding:10,
        paddingLeft:30,
        paddingRight:30,
        borderRadius:3,
        alignSelf:'flex-end',
        backgroundColor:purple,
        justifyContent:'center',
        alignItems:'center',
    },
    submitBtnText:{
        color:white,
        fontSize:23,
        textAlign:'center',
    },
})

function mapStateToProps(state){
    const key=timeToString()
    return{
       alreadLogged:state[key] && typeof state[key][0].today === "undefined",
    }
}
export default connect(mapStateToProps)(AddEntry) 