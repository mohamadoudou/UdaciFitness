import React from 'react'
import {View,Text,StyleSheet} from 'react-native'
import { gray } from '../utils/colors'
import { getMetricMetaInfo } from '../utils/helpers'



export default function MetricCard({metrics}){
    return(
      <View>
          {Object.keys(metrics).map((metric)=>{
              const {getIcon,displayName,unit,backgroundColor}=getMetricMetaInfo(metric)
            return(
                <View style={styles.metric} key={metric}> 
                    <View>
                    {getIcon()}
                    </View>
                    <View>
                        <Text style={{fontSize:20}}>
                            {displayName}
                        </Text>
                        <Text style={{fontSize:16,color:gray}}>
                            {metrics[metric]} {unit}
                        </Text>
                    </View>
                </View>
            )
         })}
      </View>
    )
}

const styles=StyleSheet.create({
metric:{
    flexDirection:'row',
    marginTop:12,
}

})