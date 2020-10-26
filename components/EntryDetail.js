import React, { Component } from 'react'
import { View, Text, StyleSheet,Platform} from 'react-native'
import { connect } from 'react-redux'
import { white } from '../utils/colors'
import MetricCard from './MetricCard'
import { addEntry } from '../actions'
import { removeEntry } from '../utils/api'
import { timeToString, getDailyReminderValue } from '../utils/helpers'
import TextButton, { textButton } from './TextButton'


class EntryDetail extends Component {

    reset = () => {
        const { remove, goBack, entryId } = this.props
        remove()
        removeEntry(entryId)
        goBack()
    }
    shouldComponentUpdate(nextProps) {
        return nextProps.metrics[0] !== null && !nextProps.metrics[0].today
    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <Text style={{ color: 'blue', fontSize: 16 }}>Entry Detail {this.props.route.params.entryId}</Text>
                {this.props.metrics[0] ?
                    <View style={{ flex: 1 }}>
                        <MetricCard metrics={this.props.metrics[0]} />
                        <View style={styles.reset}>
                            <TextButton onPress={this.reset} style={[styles.reset, { margin: 4 }]}>
                                RESET
                            </TextButton>
                        </View>
                    </View>
                    : <View style={styles.item}>
                        <Text style={styles.noDataText}>No Data for this selected day</Text>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: white,
        borderRadius: Platform.OS === 'ios' ? 16 : 2,
        padding: 20,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        justifyContent: 'center',
        shadowRadius: 3,
        shadowOpacity: 0.8,
        shadowColor: 'rgba(0,0,0,0.24)',
        shadowOffset: {
            width: 0,
            height: 3,
        }
    },
    noDataText: {
        fontSize: 20,
        paddingTop: 20,
        paddingBottom: 20,
    },
    reset: {

        justifyContent:'center',
        alignItems:'center', 
    }
})

function mapStateToProps(state, { route }) {
    const { entryId } = route.params
    return {
        entryId,
        metrics: state[entryId]
    }
}

function mapDispatchToProps(dispatch, { route, navigation }) {
    const { entryId } = route.params
    console.log('entryId in detail', entryId)
    return {
        remove: () => dispatch(addEntry({
            [entryId]: timeToString() === entryId ? getDailyReminderValue() : null
        })),
        goBack: () => navigation.goBack()
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetail)