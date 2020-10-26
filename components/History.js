import React, { Component } from 'react'
import { View, Text, StyleSheet, Platform } from 'react-native'
import { connect } from 'react-redux'
import { fetchCalendarResults } from '../utils/api'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import{Agenda as UdaciFitnessCalendar} from 'react-native-calendars'
import { white } from '../utils/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import MetricCard from './MetricCard'

class History extends Component {
    
    state={
        key:timeToString()
    }

    componentDidMount() {
        fetchCalendarResults()
            .then((entries) => this.props.dispatch(receiveEntries(entries)))
            .then(({ entries }) => {
                if (!entries[timeToString()]) {
                    this.props.dispatch(addEntry({
                        [timeToString()]: getDailyReminderValue()
                    }))
                }
            })
    }

    renderItem=({today,...metrics})=>{
        return(
            <View style={styles.item}>
            {today?
            <Text style={styles.noDataText}>{today}</Text>
            :<TouchableOpacity onPress={()=>this.props.navigation.navigate('EntryDetail',{entryId:this.state.key})}>
                <MetricCard metrics={metrics}/>
            </TouchableOpacity>
        }
        </View>
        )
    }
    renderEmptyData(formattedDate){
        return(
            <View style={styles.item}>
                <Text style={styles.noDataText}>No Data for this day</Text>
            </View>
        )
    }
    
    dayPress=(day)=>{
        this.setState(()=>({
            key:day.dateString
        }))
    }
    render() {
        const {entries}=this.props
        const {key}=this.state
        return (
                <UdaciFitnessCalendar
                items={entries}
                onDayPress={this.dayPress}
                renderItem={(item, firstItemInDay)=>this.renderItem(item,firstItemInDay)}
                renderEmptyData={this.renderEmptyData}
                />
        )
    }
}

const styles=StyleSheet.create({
    item:{backgroundColor:white,
    borderRadius:Platform.OS==='ios'?16:2,
    padding:20,
    marginLeft:10,
    marginRight:10,
    marginTop:17,
    justifyContent:'center',
    shadowRadius:3,
    shadowOpacity:0.8,
    shadowColor:'rgba(0,0,0,0.24)',
    shadowOffset:{
        width:0,
        height:3,
    }
    },
    noDataText:{
        fontSize:20,
        paddingTop:20,
        paddingBottom:20,
    }
})

function mapStateToProps(entries){
    return{
        entries
    }
}

export default connect(mapStateToProps)(History)